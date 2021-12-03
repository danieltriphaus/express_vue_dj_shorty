require("dotenv").config();
const path = require("path");
const fs = require("fs");

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
    https: {
      key: fs.readFileSync(process.env.HTTPS_CERT_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT),
    },
    proxy: {
      "/api/": {
        target: "http://localhost:3000/",
        logLevel: "debug",
        changeOrigin: true
      }
    }
  }
};
