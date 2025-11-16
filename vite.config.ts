import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ["collectables-ordinance-anticipated-leaving.trycloudflare.com"]
  },
  resolve: {
    alias: {
      'valtio/react': 'valtio/vanilla' // beware: only safe if nobody expects React-specific APIs
    },
  }
})
