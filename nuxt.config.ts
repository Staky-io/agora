import { defineNuxtConfig } from 'nuxt'
import webpack from 'webpack'
import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  publicRuntimeConfig: {
    name: process.env.APP_NAME,
    scoreAddress: process.env.APP_SCORE_ADDRESS,
    iconNetwork: process.env.APP_ICON_NETWORK,
    logoHash: process.env.APP_LOGO_HASH,
    twitter: process.env.APP_TWITTER,
    discord: process.env.APP_DISCORD,
    github: process.env.APP_GITHUB,
  },
  app: {
    head: {
      title: 'Agora',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  css: [
    '@kangc/v-md-editor/lib/style/base-editor.css',
    '@kangc/v-md-editor/lib/style/preview.css',
    '@kangc/v-md-editor/lib/theme/style/github.css',
    '~/assets/styles/tailwind.css',
    '~/assets/styles/fonts.css',
    '~/assets/styles/global.css',
    '~/assets/styles/overrides.css',
    '~/assets/styles/transitions.css',
    '~/assets/styles/typography.css',
    '~/assets/styles/utils.css',
  ],
  plugins: [
    '~/plugins/pinia-persistedstate.client',
  ],
  buildModules: [
    '@pinia/nuxt',
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  builder: isDev ? 'vite' : 'webpack',
  ...isDev
    ? {
      vite: {
        plugins: [
          commonjs(),
          inject({
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
        optimizeDeps: {
          include: [
            'buffer',
          ],
        },
      },
    }
    : {
      webpack: {
        plugins: [
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
        ],
      },
    },
})
