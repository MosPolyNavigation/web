// noinspection JSUnusedGlobalSymbols

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useHttps = env.USE_HTTPS?.toLowerCase() === 'true'
  const keyPath = path.join(__dirname, 'localhost-key.pem')
  const certPath = path.join(__dirname, 'localhost.pem')
  const canUseHttps = useHttps && fs.existsSync(keyPath) && fs.existsSync(certPath)
  const base = env.VITE_BASE_PATH?.trim()

  return {
    plugins: [
      react(),
      svgr(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        includeAssets: [
          '/img/favicon/apple-touch-icon.png',
          '/img/favicon/web-app-manifest-512x512.png',
          '/img/favicon/web-app-manifest-192x192.png',
          '/img/favicon/favicon-32.png',
          '/img/favicon/favicon-192.png',
          '/fonts/gilroy/*.{woff2,woff,otf,ttf}',
          '/fonts/gothamssm/*.{woff2,woff,otf,ttf}',
        ],
        includeManifestIcons: true,
        workbox: {
          globPatterns: [],
          runtimeCaching: [],
          navigateFallback: null,
          skipWaiting: true,
          clientsClaim: true,
        },
        manifest: {
          name: 'Политех Навигация',
          short_name: 'Политех Навигация',
          description: 'Навигация по кампусу Московского Политеха',
          lang: 'ru',
          dir: 'ltr',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#131416',
          background_color: '#131416',
          start_url: base,
          scope: base,
          id: base,
          icons: [
            // Для вкладок и обычного отображения (со скруглением)
            {
              src: '/img/favicon/favicon-32.png',
              sizes: '32x32',
              type: 'image/png',
              purpose: 'any',
            },
            // Для вкладок и обычного отображения (со скруглением)
            {
              src: '/img/favicon/favicon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            // Резерв высокого разрешения (со скруглением)
            {
              src: '/img/favicon/favicon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            // Специально для идеальной обрезки на Android (без скругления)
            {
              src: '/img/favicon/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            // Специально для идеальной обрезки на Android (без скругления)
            {
              src: '/img/favicon/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
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
    base,
  }
})
