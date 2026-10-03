// Server-side Device Database Service & API Adapter
// Provides clean abstraction for device catalog search and legal IMEI/TAC lookup
import crypto from 'node:crypto';
import { DEVICE_TYPES, DEVICE_CATALOG, findDeviceByTAC } from './deviceCatalogData.js';

// Validate 15-digit IMEI using standard Luhn Algorithm (GSM/3GPP specification)
export function validateImeiLuhn(imei) {
  if (!imei || typeof imei !== 'string') return false;
  const clean = imei.trim();
  if (!/^\d{15}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(clean[i], 10);
    // Double every second digit starting from index 1 (second digit from left)
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// Compute secure SHA-256 hash for privacy-safe storage and duplicate prevention
export function computeImeiHash(imei) {
  if (!imei) return '';
  return crypto.createHash('sha256').update(imei.trim()).digest('hex');
}

// Mask 15-digit IMEI (leaves only the last 4 digits visible)
export function maskImei(imei) {
  if (!imei) return '';
  const clean = imei.trim();
  if (clean.length === 15) {
    return `••••••••••••${clean.slice(-4)}`;
  }
  if (clean.length > 4) {
    return '••••'.repeat(Math.floor((clean.length - 4) / 4)) + clean.slice(-4);
  }
  return clean;
}

// DeviceDatabaseService Server Adapter
export class DeviceDatabaseService {
  constructor() {
    this.externalApiKey = process.env.DEVICE_DB_API_KEY || process.env.GSMA_TAC_API_KEY || null;
    this.externalApiUrl = process.env.DEVICE_DB_API_URL || null;
  }

  // Search distinct brands, optionally filtered by device type
  async searchBrands(deviceType) {
    let list = DEVICE_CATALOG;
    if (deviceType && deviceType !== 'All') {
      const typeLower = deviceType.toLowerCase();
      list = list.filter(d => d.deviceType.toLowerCase() === typeLower);
    }
    const brandSet = new Set(list.map(d => d.brand));
    return Array.from(brandSet).sort();
  }

  // Search models by type, brand, and query string
  async searchModels({ deviceType, brand, query }) {
    let results = DEVICE_CATALOG;

    if (deviceType && deviceType !== 'All') {
      const typeLower = deviceType.toLowerCase();
      results = results.filter(d => d.deviceType.toLowerCase() === typeLower);
    }

    if (brand && brand !== 'All') {
      const brandLower = brand.toLowerCase();
      results = results.filter(d => d.brand.toLowerCase() === brandLower);
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(d => 
        d.model.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        (d.modelNumber && d.modelNumber.toLowerCase().includes(q)) ||
        `${d.brand} ${d.model}`.toLowerCase().includes(q)
      );
    }

    return results;
  }

  // Get full specifications for a single device ID
  async getDeviceDetails(id) {
    if (!id) return null;
    const found = DEVICE_CATALOG.find(d => d.id === id);
    return found || null;
  }

  // Lookup device using 15-digit IMEI & 8-digit GSMA TAC
  async getDeviceByIMEI(rawImei) {
    if (!rawImei || typeof rawImei !== 'string') {
      return {
        valid: false,
        luhnValid: false,
        message: 'IMEI is required and must be a 15-digit string.'
      };
    }

    const imei = rawImei.trim();
    const is15Digits = /^\d{15}$/.test(imei);

    if (!is15Digits) {
      return {
        valid: false,
        luhnValid: false,
        imei,
        message: 'Invalid IMEI. An IMEI number must contain exactly 15 numeric digits.'
      };
    }

    const luhnValid = validateImeiLuhn(imei);
    const tac = imei.slice(0, 8);
    const masked = maskImei(imei);
    const imeiHash = computeImeiHash(imei);

    // 1. Try external provider if API key configured
    if (this.externalApiKey && this.externalApiUrl) {
      try {
        const response = await fetch(`${this.externalApiUrl}/v1/lookup?imei=${imei}`, {
          headers: {
            'Authorization': `Bearer ${this.externalApiKey}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.brand && data.model) {
            return {
              valid: true,
              luhnValid,
              imei,
              maskedImei: masked,
              imeiHash,
              tac,
              identified: true,
              device: {
                id: `ext-${Date.now()}`,
                deviceType: data.deviceType || 'Smartphone',
                brand: data.brand,
                model: data.model,
                modelNumber: data.modelNumber || '',
                releaseYear: data.releaseYear || new Date().getFullYear(),
                specifications: data.specifications || {},
                repairabilityScore: data.repairabilityScore || 8.0,
                estimatedResaleMin: data.estimatedResaleMin || 25000,
                estimatedResaleMax: data.estimatedResaleMax || 35000,
                source: 'EXTERNAL_PROVIDER'
              }
            };
          }
        }
      } catch (err) {
        console.warn('[DeviceDatabaseService] External lookup failed, falling back to local catalog:', err.message);
      }
    }

    // 2. Query local TAC database
    const localDevice = findDeviceByTAC(tac);
    if (localDevice) {
      return {
        valid: true,
        luhnValid,
        imei,
        maskedImei: masked,
        imeiHash,
        tac,
        identified: true,
        device: localDevice,
        source: 'GSMA_TAC_LOCAL_CATALOG'
      };
    }

    // 3. Fallback when TAC cannot be matched to a known model
    return {
      valid: true,
      luhnValid,
      imei,
      maskedImei: masked,
      imeiHash,
      tac,
      identified: false,
      device: null,
      message: 'Device information could not be confirmed from this IMEI.'
    };
  }
}

const serviceInstance = new DeviceDatabaseService();

// Helper to write JSON HTTP response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

// Request dispatcher for Vite dev server and Node production server
export async function handleDeviceApiRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const rawPath = decodeURIComponent(parsedUrl.pathname);
  const cleanPath = rawPath.startsWith('/api/devices') ? rawPath.replace('/api/devices', '') : rawPath;
  const normalizedPath = cleanPath === '' ? '/' : cleanPath;
  const searchParams = parsedUrl.searchParams;

  try {
    // 1. GET /types or /api/devices/types
    if ((normalizedPath === '/types' || normalizedPath === '/') && req.method === 'GET') {
      sendJson(res, 200, { types: DEVICE_TYPES });
      return;
    }

    // 2. GET /brands or /api/devices/brands
    if (normalizedPath === '/brands' && req.method === 'GET') {
      const type = searchParams.get('type') || undefined;
      const brands = await serviceInstance.searchBrands(type);
      sendJson(res, 200, { brands });
      return;
    }

    // 3. GET /models or /api/devices/models
    if (normalizedPath === '/models' && req.method === 'GET') {
      const deviceType = searchParams.get('type') || undefined;
      const brand = searchParams.get('brand') || undefined;
      const query = searchParams.get('q') || undefined;

      const models = await serviceInstance.searchModels({ deviceType, brand, query });
      sendJson(res, 200, { models, count: models.length });
      return;
    }

    // 4. GET /details or /api/devices/details
    if (normalizedPath === '/details' && req.method === 'GET') {
      const id = searchParams.get('id');
      if (!id) {
        sendJson(res, 400, { error: 'Device ID is required' });
        return;
      }
      const device = await serviceInstance.getDeviceDetails(id);
      if (!device) {
        sendJson(res, 400, { error: 'Device not found' });
        return;
      }
      sendJson(res, 200, { device });
      return;
    }

    // 5. POST /lookup-imei or /api/devices/lookup-imei
    if ((normalizedPath === '/lookup-imei' || normalizedPath === '/imei-lookup') && req.method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => {
        bodyStr += chunk;
        if (bodyStr.length > 1e5) {
          req.destroy();
        }
      });

      req.on('end', async () => {
        try {
          const body = JSON.parse(bodyStr || '{}');
          const imei = body.imei || '';
          const result = await serviceInstance.getDeviceByIMEI(imei);
          sendJson(res, result.valid ? 200 : 400, result);
        } catch (parseErr) {
          sendJson(res, 400, { error: 'Invalid JSON request body' });
        }
      });
      return;
    }

    // Unknown endpoint
    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('[handleDeviceApiRequest] Error:', err);
    sendJson(res, 500, { error: 'Internal server error', message: err.message });
  }
}
