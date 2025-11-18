import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ["90c5c7712147.ngrok-free.app"]
  },
  resolve: {
    alias: {
      'valtio/react': 'valtio/vanilla' // beware: only safe if nobody expects React-specific APIs
    },
  }
})
