'use strict';
import * as webpack from 'webpack';
import { resolve, join } from 'path';
import { context } from './webpack.config.context';
import { MODE } from './webpack.config.util';


export function getBase () {
    const mode = context.getMode();
    const baseConfig: webpack.Configuration = {
        devtool: mode === MODE.DEVELOPMENT ? 'cheap-module-eval-source-map' : 'none',
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpg|jpeg|gif|png)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                        },
                    }],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, 
                        {
                            loader: "css-loader", 
                            options: {
                                sourceMap: mode === MODE.DEVELOPMENT
                            }
                        }, 
                        {
                            loader: "sass-loader", 
                            options: {
                                sourceMap: mode === MODE.DEVELOPMENT
                            }
                        }
                    ]
                },
                  
            ]
        },
        
        resolve: {
            extensions: [
                ".ts",
                ".tsx",
                ".js",
                "jsx"
            ],
            modules: [
                resolve(__dirname, './../src'),
                resolve(__dirname, './../node_modules'),
            ]
        },
    }

    return baseConfig;
}

