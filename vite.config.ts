// noinspection JSUnusedGlobalSymbols

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['img/**/*', 'fonts/**/*', 'data/**/*'],
      manifest: {
        name: 'Политех-навигация (ПолиНа)',
        short_name: 'ПолиНа',
        description: 'Навигация по корпусам Московского Политеха',
        theme_color: '#1a237e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ru',
        icons: [
          {
            src: 'img/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'img/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json,woff,ttf}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/mospolynavigation\.github\.io\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'polina-github-pages-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
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
