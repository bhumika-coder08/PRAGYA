import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function pragyaApiPlugin(): Plugin {
  return {
    name: 'pragya-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const queryParams: Record<string, string> = {};
            urlObj.searchParams.forEach((v, k) => {
              queryParams[k] = v;
            });

            // Dynamically load server handler in dev server
            const { handleApiRequest } = await server.ssrLoadModule('/src/server/handlers.ts');

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
            return;
          } catch (err: any) {
            console.error('[PRAGYA API Plugin Error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pragyaApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
