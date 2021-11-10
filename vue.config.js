const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        config: path.resolve(__dirname, "src/config")
      }
    }
  },
  devServer: {
    hot: true,
    disableHostCheck: true,
    proxy: {
      "/api/": {
        target: "http://localhost:3000/",
        logLevel: "debug",
        changeOrigin: true
      }
    }
  }
};
