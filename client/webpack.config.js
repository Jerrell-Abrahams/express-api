const path = require("path");

module.exports = {
  entry: "./server/index.js",
  target: "node",

  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "bundle.js",
  },
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
