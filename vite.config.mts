/// <reference types="vitest" />

import { dirname, relative } from 'node:path'
import type { UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { isDev, port, r } from './scripts/utils'
import packageJson from './package.json'

// eslint-disable-next-line node/prefer-global/process
const getEnv = (mode: string) => loadEnv(mode, process.cwd(), 'VITE_')

export function sharedConfig(mode: string): UserConfig {
  const envConfig = getEnv(mode)
  return {
    root: r('src'),
    resolve: {
      alias: {
        '~/': `${r('src')}/`,
      },
    },
    define: {
      __DEV__: isDev,
      __NAME__: JSON.stringify(packageJson.name),
      ...Object.entries(envConfig).reduce((acc: Record<string, any>, v) => {
        const key = v[0].replace('VITE_', 'import.meta.env.')
        acc[key] = `"${v[1]}"`
        return acc
      }, {}),
    },
    plugins: [
      Vue(),

      AutoImport({
        imports: [
          'vue',
          {
            'webextension-polyfill': [
              ['=', 'browser'],
            ],
          },
        ],
        dts: r('src/auto-imports.d.ts'),
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: [r('src/components')],
        // generate `components.d.ts` for ts support with Volar
        dts: r('src/components.d.ts'),
        resolvers: [
        // auto import icons
          IconsResolver({
            prefix: '',
          }),
        ],
      }),

      // https://github.com/antfu/unplugin-icons
      Icons(),

      // https://github.com/unocss/unocss
      UnoCSS(),

      // rewrite assets to use relative path
      {
        name: 'assets-rewrite',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html, { path }) {
          return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
        },
      },
    ],
    optimizeDeps: {
      include: [
        'vue',
        '@vueuse/core',
        'webextension-polyfill',
      ],
      exclude: [
        'vue-demi',
      ],
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const config = {
    ...sharedConfig(mode),
    base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
    server: {
      port,
      hmr: {
        host: 'localhost',
      },
      origin: `http://localhost:${port}`,
    },
    build: {
      watch: isDev
        ? {}
        : undefined,
      outDir: r('extension/dist'),
      emptyOutDir: false,
      sourcemap: isDev ? 'inline' : false,
      // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
      terserOptions: {
        mangle: false,
      },
      rollupOptions: {
        input: {
          sidepanel: r('src/sidepanel/index.html'),
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  } as UserConfig
  return config
})
