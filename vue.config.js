const isProduction = process.env.NODE_ENV === 'production'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const cdn = [
  '//cdn.bootcss.com/vue/2.6.12/vue.min.js',
  '//cdn.bootcss.com/axios/0.21.1/axios.min.js',
  '//cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js',
  '//cdn.bootcss.com/vue-router/3.5.1/vue-router.min.js'
]
let webpackPlugins = [],
  externals = {}
if (isProduction) {
  // 打包分析
  webpackPlugins.push(new BundleAnalyzerPlugin())
  // CDN 排除的package
  externals = {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios'
  }
}
module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://14.205.92.201:8080/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '/api' //需要rewrite重写的,
        },
        cookiePathRewrite: {
          //重写cookie路径
          '/api': '/'
        }
      }
    }
  },
  configureWebpack: {
    externals,
    plugins: webpackPlugins
  },
  chainWebpack: config => {
    if (isProduction) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
  }
}
