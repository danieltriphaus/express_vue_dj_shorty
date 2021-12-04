require("dotenv").config();
const path = require("path");
const fs = require("fs");

let devServer = {};
if (process.env.NODE_ENV === "development") {
  devServer =  {
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
}

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
  },
  devServer
};
