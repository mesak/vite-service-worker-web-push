import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { VitePWA } from 'vite-plugin-pwa'
// import { InjectManifest } from 'workbox-webpack-plugin';
// const { InjectManifest } = require('workbox-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin');

import { vitePluginServiceWorker } from './build/plugin';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // VitePWA({
    //   mode: 'development',
    //   base: '/',
    //   // registerType: null,
    //   srcDir: 'src',
    //   filename: 'sw.ts',
    //   strategies: 'injectManifest',
    //   registerType: null,
    //   injectRegister: null,
    //   injectManifest: {
    //     injectionPoint: undefined,
    //     // rollupFormat: 'iife'
    //   }
    // }),

    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true,
    // }),
    // new InjectManifest({
    //   mode: 'production', // Define the mode property
    //   swSrc: "service-worker.ts",
    //   swDest: "service-worker.js",
    //   include: ["__nothing__"],
    // })

    vitePluginServiceWorker({
      sourceFile: 'src/sw.ts',
      filename: 'sw.js',
    })
  ],
})
