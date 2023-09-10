'use strict';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import { getBase } from './webpack.config.base';


export function getProd() {
    const baseConfig = getBase();

    const productionConfig: webpack.Configuration = merge(baseConfig, {
        devtool: false,
        entry: './src/index.ts',
        output: {
            library: 'commonheader',
            libraryTarget: 'umd',
            filename: 'index.js',
            auxiliaryComment: ''
        },
    
        module: {
            rules: []
        },
    
        plugins: [
            new webpack.DefinePlugin({
              'process.env.NODE_ENV': "'production'"
            }),
          ],
    });

    return productionConfig;
}


