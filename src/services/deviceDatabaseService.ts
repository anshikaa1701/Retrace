// Client-Side Device Database Service Adapter
// Connects to server-side /api/devices API with robust offline/network fallback
import { ProductType } from '../types';
import { DEVICE_TYPES, DEVICE_CATALOG, findDeviceByTAC } from '../server/deviceCatalogData';

export interface DeviceCatalogItem {
  id: string;
  deviceType: ProductType;
  brand: string;
  model: string;
  modelNumber?: string;
  releaseYear?: number;
  specifications: {
    processor?: string;
    ram?: string;
    storage?: string;
    batteryHealth?: string;
    display?: string;
    color?: string;
    [key: string]: any;
  };
  repairabilityScore?: number;
  estimatedResaleMin?: number;
  estimatedResaleMax?: number;
  warranty?: string;
  image?: string;
  source?: string;
  tacPrefixes?: string[];
}

export interface ImeiLookupResult {
  valid: boolean;
  luhnValid: boolean;
  imei?: string;
  maskedImei?: string;
  imeiHash?: string;
  tac?: string;
  identified: boolean;
  device: DeviceCatalogItem | null;
  message?: string;
  source?: string;
}

// Client-side Luhn Check helper
export function validateLuhn(imei: string): boolean {
  if (!imei) return false;
  const clean = imei.trim();
  if (!/^\d{15}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(clean[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// Client-side Masking helper
export function maskIdentifier(identifier: string, isImei: boolean = false): string {
  if (!identifier) return '';
  const clean = identifier.trim();
  if (clean.length === 15 && /^\d+$/.test(clean)) {
    return `••••••••••••${clean.slice(-4)}`;
  }
  if (clean.length > 6) {
    return `${clean.slice(0, 3)}••••${clean.slice(-3)}`;
  }
  return '••••' + clean.slice(-2);
}

// Client-side SHA-256 Hash helper
export async function computeImeiHashClient(imei: string): Promise<string> {
  if (!imei) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(imei.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    // Basic fallback hash if SubtleCrypto is unavailable
    let hash = 0;
    const str = imei.trim();
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `hash-${Math.abs(hash)}`;
  }
}

class DeviceDatabaseServiceImpl {
  private baseUrl = '/api/devices';

  // Fetch supported device categories
  async getDeviceTypes(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/types`);
      if (res.ok) {
        const data = await res.json();
        if (data.types && Array.isArray(data.types)) {
          return data.types;
        }
      }
    } catch {
      // Offline fallback
    }
    return DEVICE_TYPES;
  }

  // Search brands, optionally filtered by device category
  async searchBrands(deviceType?: string): Promise<string[]> {
    try {
      const url = deviceType ? `${this.baseUrl}/brands?type=${encodeURIComponent(deviceType)}` : `${this.baseUrl}/brands`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.brands && Array.isArray(data.brands)) {
          return data.brands;
        }
      }
    } catch {
      // Offline fallback
    }

    let list: DeviceCatalogItem[] = DEVICE_CATALOG as DeviceCatalogItem[];
    if (deviceType && deviceType !== 'All') {
      list = list.filter((d: DeviceCatalogItem) => d.deviceType.toLowerCase() === deviceType.toLowerCase());
    }
    const brandsSet = new Set<string>(list.map((d: DeviceCatalogItem) => d.brand));
    return Array.from(brandsSet).sort();
  }

  // Search models with autocomplete query
  async searchModels(params: { deviceType?: string; brand?: string; query?: string }): Promise<DeviceCatalogItem[]> {
    const { deviceType, brand, query } = params;
    try {
      const searchParams = new URLSearchParams();
      if (deviceType && deviceType !== 'All') searchParams.set('type', deviceType);
      if (brand && brand !== 'All') searchParams.set('brand', brand);
      if (query && query.trim()) searchParams.set('q', query.trim());

      const res = await fetch(`${this.baseUrl}/models?${searchParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.models && Array.isArray(data.models)) {
          return data.models as DeviceCatalogItem[];
        }
      }
    } catch {
      // Offline fallback
    }

    // Local client-side fallback
    let results = DEVICE_CATALOG as DeviceCatalogItem[];

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

  // Fetch full details of a specific device
  async getDeviceDetails(id: string): Promise<DeviceCatalogItem | null> {
    try {
      const res = await fetch(`${this.baseUrl}/details?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.device) {
          return data.device as DeviceCatalogItem;
        }
      }
    } catch {
      // Offline fallback
    }

    const found = (DEVICE_CATALOG as DeviceCatalogItem[]).find((d: DeviceCatalogItem) => d.id === id);
    return found || null;
  }

  // Legal GSMA TAC / IMEI device lookup
  async getDeviceByIMEI(rawImei: string): Promise<ImeiLookupResult> {
    const imei = (rawImei || '').trim();
    const is15Digits = /^\d{15}$/.test(imei);
    const luhnValid = validateLuhn(imei);

    if (!is15Digits) {
      return {
        valid: false,
        luhnValid: false,
        imei,
        identified: false,
        device: null,
        message: 'IMEI must contain exactly 15 numeric digits.'
      };
    }

    // Try server endpoint
    try {
      const res = await fetch(`${this.baseUrl}/lookup-imei`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei })
      });
      if (res.ok) {
        const data: ImeiLookupResult = await res.json();
        return data;
      }
    } catch {
      // Offline fallback
    }

    // Local client-side TAC lookup fallback
    const tac = imei.slice(0, 8);
    const localDevice = findDeviceByTAC(tac) as DeviceCatalogItem | null;
    const imeiHash = await computeImeiHashClient(imei);
    const maskedImei = maskIdentifier(imei, true);

    if (localDevice) {
      return {
        valid: true,
        luhnValid,
        imei,
        maskedImei,
        imeiHash,
        tac,
        identified: true,
        device: localDevice,
        source: 'OFFLINE_LOCAL_TAC'
      };
    }

    return {
      valid: true,
      luhnValid,
      imei,
      maskedImei,
      imeiHash,
      tac,
      identified: false,
      device: null,
      message: 'Device information could not be confirmed from this IMEI.'
    };
  }
}

export const DeviceDatabaseService = new DeviceDatabaseServiceImpl();
