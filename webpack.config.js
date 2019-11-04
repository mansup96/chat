const path = require("path");

module.exports = {
  mode: "development",
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, "client/public"),
    filename: "bundlick.js"
  },
  resolve: {
    extensions: [".css", ".wasm", ".mjs", ".js", ".json", ".jsx"]
  },
  devServer: {
    contentBase: "./client/public"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: "pre",
        loader: "babel-loader",
        options: {
          plugins: [
            "@babel/plugin-transform-react-jsx",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-transform-regenerator"
          ],
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.css/,
        loader:
          "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
      },
      {
        test: /\.(jpg|png)/,
        loader: "file-loader",
        options: {
          limit: 100000,
          name: "[name].[hash:8].[ext]",
          outputPath: "eeed/"
        }
      }
    ]
  }
};
