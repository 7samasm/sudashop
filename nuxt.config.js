const webpack = require('webpack')
const colors = require('vuetify/es5/util/colors').default

module.exports = {
  srcDir: 'client/',
  buildDir: 'dist/client/',
  rootDir: './',
  modern: 'server',
  /*
  ** Router config
  */
  router: {
    // middleware: [
    //   'check-auth'
    // ]
    routeNameSplitter : '/'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Hare 2.0',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Build config
  */
  build: {
    publicPath: '/hare/',
    extractCSS: true,
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    extend(config) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/
        })
      )
    }
  },
  /*
  ** Customize the Progress Bar
  */
 loading: { color: '#ffffff' , height : '2px'},
  /*
  ** Generate config
  */
  generate: {
    dir: '.generated'
  },
  /*
  ** Global CSS
  */
  css: [
    // 'normalize.css/normalize.css',
    // 'element-ui/lib/theme-chalk/index.css',
    // { src: '@/assets/styles/main.scss', lang: 'scss' }
  ],
  /*
  ** Add element-ui in our app, see plugins/element-ui.js file
  */
  plugins: [
    { src: '@/plugins/vuelidate', ssr: true },
    '@/plugins/api'
  ],
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/proxy',
    '@nuxtjs/auth',
    '@nuxtjs/moment',
    [
      'vue-currency-filter/nuxt',
      {
        symbol : 'SDG',
        thousandsSeparator: ',',
        fractionCount: 2,
        fractionSeparator: '.',
        symbolPosition: 'back',
        symbolSpacing: true
      }
    ]
  ],
  axios: {
    browserBaseURL: '/'
  },
  auth : {
    redirect : {
      logout : '/',
      login  : '/admin/login'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url : '/hpi/admin/login' , method : 'post' , propertyName : 'token' },
          user : { url : '/hpi/admin/user' , method : 'get' ,  propertyName : 'user'},
          logout: false
        },
        // tokenRequired : false,
        tokenType     : '',
        tokenName     : 'x-Auth'
      }
    }
  },
  // koa-proxies for dev, options reference https://github.com/nodejitsu/node-http-proxy#options
  development: {
    proxies: [
      /* {
        path: '/hpi/',
        target: 'http://localhost:3000/',
        logs: true,
        prependPath: false,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pages(\/|\/\w+)?$/, '/service')
      } */
    ]
  },
  env: {
    baseUrl : process.env.BASE_URL || 'http://localhost:3000',
  },
}
