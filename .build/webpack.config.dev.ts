import * as webpack from "webpack";
import { resolve, join } from "path";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { getBase } from "./webpack.config.base";

export function getDev() {
    const baseConfig = getBase();
    const { HotModuleReplacementPlugin } = webpack;
    const port = 3000;
    const context = resolve(__dirname + "./../src");

    const devConfig: webpack.Configuration = Object.assign(baseConfig, {
        name: "client",
        target: "web",
        context,
        entry: {
            app: [
                `webpack-dev-server/client?http://localhost:${port}`,
                "webpack/hot/only-dev-server",
                "./index",
            ],
        },

        output: {
            path: resolve(__dirname, "./../dist"),
            filename: "index.js",
        },

        devtool: "cheap-module-eval-source-map",
        module: {
            rules: [],
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": "'development'",
            }),
            new HtmlWebpackPlugin({
                template: "./index.html",
                hash: true,
                filename: "index.html",
                inject: "body",
            }),
            new HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
        ],

        devServer: {
            contentBase: join(__dirname, "./../dist"),
            compress: false, // gzip
            port: 9000,
            client: {
                progress: true,
                overlay: true,
            },
        },
    });

    return devConfig;
}
