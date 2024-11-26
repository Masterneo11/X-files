// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [], // Make sure these dependencies are pre-bundled
  },
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173, // Optional: Default port for Vite
  },
});
