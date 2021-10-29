module.exports = {
  configureWebpack: {},
  devServer: {
    hot: true,
    disableHostCheck: true,
    proxy: {
      "/api/": {
        target: "http://localhost:3000/",
        logLevel: "debug"
      }
    }
  }
};
