// noinspection JSUnusedGlobalSymbols

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useHttps = env.USE_HTTPS?.toLowerCase() === 'true'
  const keyPath = path.join(__dirname, 'localhost-key.pem')
  const certPath = path.join(__dirname, 'localhost.pem')
  const canUseHttps = useHttps && fs.existsSync(keyPath) && fs.existsSync(certPath)

  return {
    plugins: [react(), svgr()],
    server: {
      // включаем https если USE_HTTPS=true
      ...(canUseHttps
        ? {
            https: {
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath),
            },
          }
        : {}),
      port: 3000,
      host: true,
    },

    root: './',
    publicDir: 'public',
    build: {
      outDir: 'dist',
    },

    css: {
      preprocessorOptions: {
      scss: {},
      },
      modules: {
        generateScopedName: '[local]__[hash:base64:2]',
      },
      devSourcemap: true,
    },
    base: '/web/',
  }
})
