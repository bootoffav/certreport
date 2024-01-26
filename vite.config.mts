import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    define: {
      'import.meta.env': {},
    },
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});
