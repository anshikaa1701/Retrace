import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleAiChatRequest } from './src/server/aiChatMiddleware.js';
import { handleDeviceApiRequest } from './src/server/deviceDatabaseMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');

// MIME types mapping for high-performance static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Normalize URL and remove query params
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Health check endpoint (for Docker / Kubernetes / load balancers)
  if (pathname === '/health' || pathname === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      status: 'ok', 
      app: 'retrace', 
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString() 
    }));
    return;
  }

  // 2. Secure Backend AI Diagnostic Chat endpoint (Gemini API Integration)
  if (pathname === '/api/ai/chat') {
    handleAiChatRequest(req, res);
    return;
  }

  // 2b. Device Database & IMEI Lookup endpoints
  if (pathname.startsWith('/api/devices')) {
    handleDeviceApiRequest(req, res);
    return;
  }

  // 3. Static File Serving & SPA Fallback
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Method Not Allowed');
    return;
  }

  // Prevent path traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath);

  // Check if static file exists in dist
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveStaticFile(filePath, res, req.method === 'HEAD');
      return;
    }

    // If it's a directory, check for index.html inside
    if (!err && stats.isDirectory()) {
      const dirIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(dirIndex)) {
        serveStaticFile(dirIndex, res, req.method === 'HEAD');
        return;
      }
    }

    // SPA fallback: serve dist/index.html for client-side routing
    const spaIndex = path.join(DIST_DIR, 'index.html');
    fs.stat(spaIndex, (indexErr, indexStats) => {
      if (!indexErr && indexStats.isFile()) {
        serveStaticFile(spaIndex, res, req.method === 'HEAD', true);
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<h1>404 - Application Not Built Yet</h1><p>Run "npm run build" to generate dist/ assets.</p>');
      }
    });
  });
});

function serveStaticFile(filePath, res, isHead = false, isSpaFallback = false) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);

  // Caching headers:
  // - Hashed assets (/assets/*): cache for 1 year immutable
  // - HTML and SPA fallbacks: do not cache so users always get fresh releases
  if (!isSpaFallback && filePath.includes(path.sep + 'assets' + path.sep)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }

  if (isHead) {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Server Error');
    }
  });
  stream.pipe(res);
}

server.listen(PORT, HOST, () => {
  console.log(`[ReTrace Production Server] Running at http://${HOST}:${PORT}`);
  console.log(`[ReTrace Production Server] Serving assets from: ${DIST_DIR}`);
  console.log(`[ReTrace Production Server] Healthcheck available at: http://${HOST}:${PORT}/health`);
  console.log(`[ReTrace Production Server] AI Assistant API active at: http://${HOST}:${PORT}/api/ai/chat`);
  if (!process.env.GEMINI_API_KEY && !process.env.VITE_GEMINI_API_KEY) {
    console.log('[ReTrace Production Server] Notice: GEMINI_API_KEY is not set. ReTrace AI will use the built-in intelligent diagnostic engine.');
  }
});

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`[ReTrace Production Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[ReTrace Production Server] Closed all connections. Exiting process.');
    process.exit(0);
  });

  // Force shutdown if connections do not close in 5 seconds
  setTimeout(() => {
    console.error('[ReTrace Production Server] Forceful shutdown after timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
