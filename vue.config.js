const path = require("path");
//const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        config: path.resolve(__dirname, "src/config")
      }
    },
    watchOptions: {
      poll: 1000,
    }
    /*
    plugins: [
      new Dotenv()
    ] */
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
