"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");



// 基于 webpack5 的配置，代码入口为 ./src/index.ts, 支持 webpack-dev-server, 支持 sass，支持对 React 的编译，支持typescrict， 支持热更新。output 目录为 ./dist，产出为 es5 的代码
module.exports = (env, arg) => {
  const isDevelopment = arg.mode !== "production";
  console.log("------------------- isDevelopment: ", arg);

  return {
    mode: "development",
    entry: isDevelopment ? "./demo/app.tsx" : "./src/index.ts",
    output: {
      filename: "index.js",
      path: __dirname + "/dist",
      clean: true,
      library: {
        name: "SSMLTagEditor",
        type: "umd",
      },
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
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
        filename: "[name].css",
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

    devtool: isDevelopment ? "eval-source-map" : false,
  }
};
