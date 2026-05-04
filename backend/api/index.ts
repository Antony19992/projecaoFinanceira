import type { Application } from 'express';

const ALLOWED_ORIGIN = 'https://projecao-financeira-kappa.vercel.app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
}

let startupError: unknown = null;
let expressApp: Application | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  expressApp = require('../src/app').default as Application;
} catch (err) {
  startupError = err;
  console.error('[api/index startup crash]', err);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function handler(req: any, res: any) {
  addCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!expressApp) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server startup failed', details: String(startupError) }));
    return;
  }

  expressApp(req, res);
}
