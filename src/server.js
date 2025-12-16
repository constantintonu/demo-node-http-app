import http from 'node:http';
import { handler } from './app.js';

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    // Last-resort error handler (avoid leaking internals)
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));

    // Log to stderr for debugging
    console.error(err);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Try:');
  console.log('  GET /health');
  console.log('  GET /api/echo?msg=hello');
  console.log('  GET /api/sum?a=2&b=3');
});
