// ==============================================
// VITE CONFIGURATION FILE
// ==============================================
// This file tells Vite how to build our React app
// Vite is a fast build tool that helps us develop React apps quickly

import { defineConfig } from 'vite'  // Import Vite's config function
import react from '@vitejs/plugin-react'  // Import React plugin for Vite

// Export the configuration
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api gets forwarded to the backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

