const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { 
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './app')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          use: 'css-loader?-url'
        })
      }
      // ,
      // { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
    ]
  },
  // devServer: {
  //   historyApiFallback: true,
  // },
  plugins: [
    new ExtractTextPlugin('extracted.css'),
    // Make sure this is after ExtractTextPlugin!
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      // paths: [path.join(__dirname, 'app/index.html')]
      paths: [path.join(__dirname, 'app/index.html'), path.join(__dirname, 'app/index.js'), path.join(__dirname, 'app/components/Loans.js')]
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  )
}

module.exports = config;
