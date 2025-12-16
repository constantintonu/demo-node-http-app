import { URL } from 'node:url';

/**
 * Minimal JSON API handler.
 * Exported for testing.
 */
export async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Basic CORS for demo convenience
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method Not Allowed' });
  }

  if (url.pathname === '/health') {
    return json(res, 200, { status: 'ok' });
  }

  if (url.pathname === '/api/echo') {
    const msg = url.searchParams.get('msg');
    if (!msg) return json(res, 400, { error: 'Missing required query param: msg' });
    if (msg.length > 200) return json(res, 400, { error: 'msg must be <= 200 characters' });
    return json(res, 200, { echo: msg });
  }

  if (url.pathname === '/api/sum') {
    const a = parseNumber(url.searchParams.get('a'));
    const b = parseNumber(url.searchParams.get('b'));
    if (a == null || b == null) {
      return json(res, 400, { error: 'Query params a and b must be valid numbers' });
    }
    return json(res, 200, { a, b, sum: a + b });
  }

  return json(res, 404, { error: 'Not Found' });
}

export function parseNumber(value) {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function json(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}
