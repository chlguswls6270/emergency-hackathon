import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // explicitly listen on localhost
    port: 3000,        // explicitly use port 3000
    strictPort: true,  // (optional) throw an error if port 3000 is already in use, instead of automatically picking the next available port
  }
})
