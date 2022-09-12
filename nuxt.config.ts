import { defineNuxtConfig } from 'nuxt'
import webpack from 'webpack'
import inject from '@rollup/plugin-inject'
import commonjs from '@rollup/plugin-commonjs'

const isDev = process.env.NODE_ENV === 'development'

const parseTwitter = (twitter: string): string => {
  try {
    const url = new URL(twitter)
    return `@${url.pathname.split('/').filter(Boolean)[0]}`
  } catch (error) {
    return `@${twitter}`
  }
}

export default defineNuxtConfig({
  publicRuntimeConfig: {
    name: process.env.APP_NAME,
    scoreAddress: process.env.APP_SCORE_ADDRESS,
    symbol: process.env.APP_SYMBOL,
    iconNetwork: process.env.APP_ICON_NETWORK,
    logoHash: process.env.APP_LOGO_HASH,
    twitter: process.env.APP_TWITTER,
    discord: process.env.APP_DISCORD,
    github: process.env.APP_GITHUB,
  },
  app: {
    head: {
      title: `${process.env.APP_NAME} - Agora governance`,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: `Welcome to the Agora governance page of ${process.env.APP_NAME}.` },
        { name: 'twitter:title', content: `${process.env.APP_NAME} - Agora governance` },
        { name: 'twitter:url', content: isDev || !process.env.APP_URL ? 'http://localhost:3000/' : process.env.APP_URL },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: parseTwitter(process.env.APP_TWITTER) },
        { name: 'twitter:image', content: '/agora.png' },
        { name: 'twitter:description', content: `Welcome to the Agora governance page of ${process.env.APP_NAME}.` },
        { name: 'og:url', content: isDev || !process.env.APP_URL ? 'http://localhost:3000/' : process.env.APP_URL },
        { name: 'og:title', content: `${process.env.APP_NAME} - Agora governance` },
        { name: 'og:description', content: `Welcome to the Agora governance page of ${process.env.APP_NAME}.` },
        { name: 'og:image', content: '/agora.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
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
