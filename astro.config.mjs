import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import compressor from 'astro-compressor';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { VitePWA } from 'vite-plugin-pwa';

import { manifest } from './src/utils/manifest';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4322/',
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: 'min-light',
      wrap: true,
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'min-light',
        wrap: true,
      },
      drafts: true,
      components: {
        pre: './src/components/mdx/Code.astro',
      },
    }),
    compressor({ gzip: true, brotli: true }),
    sitemap(),
    tailwind(),
    robotsTxt(),
  ],
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        workbox: {
          globDirectory: 'dist',
          globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
          navigateFallback: null,
        },
      }),
    ],
  },
});
