import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

import { handler, parseNumber } from '../src/app.js';

function startTestServer() {
  const server = http.createServer((req, res) => handler(req, res));

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

test('parseNumber', () => {
  assert.equal(parseNumber('2'), 2);
  assert.equal(parseNumber('2.5'), 2.5);
  assert.equal(parseNumber('   3  '), 3);
  assert.equal(parseNumber(''), 0); // Number('') === 0
  assert.equal(parseNumber(null), null);
  assert.equal(parseNumber('nope'), null);
  assert.equal(parseNumber('Infinity'), null);
});

test('GET /health returns ok', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { status: 'ok' });
  } finally {
    server.close();
  }
});

test('GET /api/echo validates msg', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const resMissing = await fetch(`${baseUrl}/api/echo`);
    assert.equal(resMissing.status, 400);

    const resOk = await fetch(`${baseUrl}/api/echo?msg=hello`);
    assert.equal(resOk.status, 200);
    assert.deepEqual(await resOk.json(), { echo: 'hello' });
  } finally {
    server.close();
  }
});

test('GET /api/sum returns sum and validates numbers', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const resBad = await fetch(`${baseUrl}/api/sum?a=1&b=NaN`);
    assert.equal(resBad.status, 400);

    const resOk = await fetch(`${baseUrl}/api/sum?a=2&b=3.5`);
    assert.equal(resOk.status, 200);
    assert.deepEqual(await resOk.json(), { a: 2, b: 3.5, sum: 5.5 });
  } finally {
    server.close();
  }
});

test('unknown route is 404', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/nope`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('non-GET is 405', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/health`, { method: 'POST' });
    assert.equal(res.status, 405);
  } finally {
    server.close();
  }
});
