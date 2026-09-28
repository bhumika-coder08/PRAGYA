/**
 * PRAGYA VERCEL SERVERLESS HANDLER
 *
 * Exposes PRAGYA scientific API endpoints for Vercel deployment:
 * /api/health, /api/sources, /api/observations, /api/features,
 * /api/precursors, /api/fingerprint, /api/near-miss, /api/information-value, /api/models.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from '../src/server/handlers.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const rawUrl = (req.headers['x-forwarded-uri'] as string) || req.url || '/';
    const urlObj = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
    const queryParams: Record<string, string> = {};
    urlObj.searchParams.forEach((v, k) => {
      queryParams[k] = v;
    });

    let body: any = undefined;
    if (req.method === 'POST' || req.method === 'PUT') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    }

    const response = await handleApiRequest(req.method || 'GET', urlObj.pathname, queryParams, body);
    res.statusCode = response.status;
    for (const [k, v] of Object.entries(response.headers)) {
      res.setHeader(k, v);
    }
    res.end(JSON.stringify(response.data));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Serverless execution error', timestamp: new Date().toISOString() }));
  }
}
