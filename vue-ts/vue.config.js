module.exports = {
  // 反向代理
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      '/api': {
        target: 'http://localhost:5000/api',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => { },

  },
  // 解决打包错误
  publicPath: './',
  css: {
    sourceMap: true
  },
  productionSourceMap: false,
  configureWebpack: {
    devtool: "eval-source-map"
  }
};
