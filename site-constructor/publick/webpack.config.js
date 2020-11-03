const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports={
    entry: './src/index.js',
    output:{
        filename:'[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins:[
        new HTMLWebpackPlugin({
            template: './src/index.html'
        })
    ],
    module:{
        rules:[
            {
                test: /\.css$/,
                use:['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              }
        ]
    },
    devServer:{
        port: 3000
    }
    
}