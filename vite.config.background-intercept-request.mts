/*
 * @Author: Lu
 * @Date: 2025-03-17 22:40:35
 * @LastEditTime: 2025-03-18 23:56:01
 * @LastEditors: Lu
 * @Description:
 */
import { defineConfig } from 'vite'
import packageJson from './package.json'
import { isDev, r } from './scripts/utils'
import { sharedConfig } from './vite.config.mjs'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  define: {
    '__DEV__': isDev,
    '__NAME__': JSON.stringify(packageJson.name),
    // https://github.com/vitejs/vite/issues/9320
    // https://github.com/vitejs/vite/issues/9186
    'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
  },
  build: {
    watch: isDev
      ? {}
      : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/background/interceptRequest.ts'),
      name: packageJson.name,
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: (chunk) => {
          if (chunk.name === 'main')
            return 'index.mjs'
          else
            return 'interceptRequest.mjs'
        },
        extend: true,
      },
    },
  },
})
