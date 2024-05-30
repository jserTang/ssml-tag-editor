"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const isDevelopment = process.env.NODE_ENV != "production";

module.exports = (env, arg) => {
  console.log("------------------- isDevelopment: ", process.env.NODE_ENV);

  return {
    mode: 'development' || process.env.NODE_ENV,
    entry: isDevelopment ? "./demo/app.tsx" : "./src/index.ts",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      library: {
        type: "umd",
      },
    },
    // experiments: {
    //   outputModule: true,
    // },
    resolve: {
      symlinks: true,
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  
    plugins: [
      isDevelopment && new HtmlWebpackPlugin({
          inject: "body",
          template: "./public/index.html",
          hash: true,
          filename: "index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "index.css",
        chunkFilename: "[id].css",
      }),
      new ForkTsCheckerWebpackPlugin(),
  
      isDevelopment && new HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
  
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      historyApiFallback: true,
      port: 3000,
      hot: true,
    },

    devtool: 'eval-cheap-module-source-map' || isDevelopment ? "eval-cheap-module-source-map" : false,
  }
};
