import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Preserve the existing public API URL without exposing any other process env.
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API': JSON.stringify(env.REACT_APP_API || ''),
    },
    build: { outDir: 'build' },
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1' },
  };
});
