import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['assets/**/*', 'favicon.ico'],
        manifest: {
          id: '/',
          name: 'Emergency Europe 112',
          short_name: 'Urgences 112',
          description: 'Numéros d\'urgence officiels en Europe, premiers secours, métronome RCP, SMS SOS et lexique multilingue 100% hors-ligne.',
          theme_color: '#301934',
          background_color: '#1A091E',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/assets/aistudio/Ic_ne_d_urgence_europ_enne_0d8243ae.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/aistudio/Ic_ne_d_urgence_europ_enne_0d8243ae.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/aistudio/Ic_ne_d_urgence_europ_enne_0d8243ae.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          navigateFallback: '/index.html',
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
