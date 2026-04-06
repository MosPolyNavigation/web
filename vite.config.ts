// noinspection JSUnusedGlobalSymbols

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'

type PlanDto = {
  wayToSvg?: string
}

type LocationsDto = {
  plans?: PlanDto[]
}

function getOfflineMapsManifestEntries() {
  const mapsBaseUrl = 'https://mospolynavigation.github.io/navigationData/'
  const dodImageUrl = 'https://mospolynavigation.github.io/navigationData/sources/dod-image.png'
  const dataPath = resolve(process.cwd(), 'public/data/locationsV2.json')
  const raw = readFileSync(dataPath, 'utf-8')
  const data = JSON.parse(raw) as LocationsDto
  const mapUrls = (data.plans ?? [])
    .map((plan) => plan.wayToSvg?.trim())
    .filter((wayToSvg): wayToSvg is string => !!wayToSvg)
    .map((wayToSvg) => new URL(wayToSvg, mapsBaseUrl).toString())

  const uniqueUrls = Array.from(new Set([...mapUrls, dodImageUrl]))
  return uniqueUrls.map((url) => ({
    url,
    revision: null,
  }))
}

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
  svgr(),
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
        additionalManifestEntries: getOfflineMapsManifestEntries(),
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
      scss: {},
    },
    modules: {
      generateScopedName: '[local]__[hash:base64:2]',
    },
    devSourcemap: true,
  },
  base: '/web/',
})
