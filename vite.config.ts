import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Note: we expose the Gemini API key to the client bundle under
    // `import.meta.env.VITE_GEMINI_API_KEY`. Vite injects this value at
    // build/dev time. Keep secret keys out of client bundles for
    // production — prefer server-side usage or a secure proxy.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Define global replacement values for the Vite dev server.
      // Here we map the loaded environment variable into the
      // `import.meta.env.VITE_GEMINI_API_KEY` key so client code can
      // access it as `import.meta.env.VITE_GEMINI_API_KEY`.
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
