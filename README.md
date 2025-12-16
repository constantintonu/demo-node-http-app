# demo-node-http-app

A lightweight Node.js demo API with **zero runtime dependencies** and tests using Node's built-in `node:test` runner.

## Requirements

- Node.js **18+**

## Run

```bash
npm install   # no deps, but keeps the workflow familiar
npm start
```

Then open:
- `http://localhost:3000/health`
- `http://localhost:3000/api/echo?msg=hello`
- `http://localhost:3000/api/sum?a=2&b=3`

## Dev mode (auto-reload)

```bash
npm run dev
```

## Tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Project structure

- `src/app.js` – request handler (exported for tests)
- `src/server.js` – HTTP server entrypoint
- `test/app.test.js` – unit + integration tests
