module.exports = {
  publicPath: './',
  assetsDir: "static",
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('postcss-px2rem')({
            remUnit: 37.5
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '储值卡';
      return args;
    })
  }
}