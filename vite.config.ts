// noinspection JSUnusedGlobalSymbols

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    https: {
      key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
    },
    port: 3000,
    host: true
  },

  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
    modules: {
      generateScopedName: '[local]__[hash:base64:2]',
    },
    devSourcemap: true,
  },
  base: '/web/',
})
