export const server = {
  port: 3000,
  host: '127.0.0.1',
}
export const mode = 'spa'
export const env = {
  cinema: process.env.cinema
}
export const head = {
  title: 'terminal',
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      hid: 'description',
      name: 'description',
      content: 'Sale terminal',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
}
export const css = [`~/assets/scss/${process.env.cinema}.scss`]
export const modules = ['@nuxtjs/axios']
export const plugins = ['~/plugins/touch-events.js']
export const axios = {
  debug: true,
  credentials: true,
}
export const build = {
  vendor: ['axios'],
  /*
   ** Run ESLint on save
   */
  extend(config, { isDev, isClient }) {
    if (isDev && isClient) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      })
    }
  },
}
