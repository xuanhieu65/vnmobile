// Libraries
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const multi = require('multi-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('babel-polyfill');

// const viewsFolder = path.resolve(__dirname, '../src/views/pages');

// Files
const utils = require('./utils');
const plugins = require('../postcss.config');
// Configuration
module.exports = (env) => {
  const devMode = env.NODE_ENV === 'development';
  const config = {
    context: path.resolve(__dirname, '../src'),
    entry: {
      app: [
        'babel-polyfill',
        './assets/styles/_app.scss',
        './app.js',
      ],
      // app_JP: [
      //   'babel-polyfill',
      //   './assets/styles/_app-JP.scss',
      //   './app_JP.js',
      // ],
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      // publicPath: '/',
      filename: 'assets/js/[name].bundle.js',
    },
    devServer: {
      contentBase: path.resolve(__dirname, '../src'),
      // hot: true,
    },
    resolve: {
      extensions: ['.js', '.css', '.scss'],
      alias: {
        source: path.resolve(__dirname, '../src'), // Relative path of src
        images: path.resolve(__dirname, '../src/assets/images'), // Relative path of images
      },
    },
    /*
          Loaders with their configurations
        */
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env'],
                plugins: ['syntax-dynamic-import'],
              },
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader?sourceMap',
            'sass-loader?sourceMap',
          ],
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
            },
          ],
        },
        {
          test: /\.(gif|svg|ico)$/,
          use: [
            {
              loader: 'image-webpack-loader',
            },
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: 'assets/images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png)$/i,
          loader: multi(
            'file-loader?name=assets/images/[name].[ext].webp!webp-loader?{quality: 100}',
            'file-loader?name=assets/images/[name].[ext]',
          ),
        },
        {
          test: /\.(woff2?|woff|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: 'assets/fonts/[name].[ext]',
          },
        },
        {
          test: /\.(json)(\?.*)?$/,
          exclude: [/node_modules/],
          loader: 'url-loader',
          options: {
            name: 'assets/[name].[ext]',
          },
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/videos/[name].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: path.join(__dirname, '..'),
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets/images/',
          to: 'assets/images/[name].[ext]',
        },
      ]),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        allChunks: true,
      }),
    //   new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //   }),

      /*
      Pages
    */

      // // Desktop page
      new HtmlWebpackPlugin({
        locale: 'en_EN',
        filename: 'index.html',
        template: 'views/index.pug',
        chunks: ['app', 'index'],
        chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      }),
      // new HtmlWebpackPlugin({
      //   locale: 'jp_JP',
      //   filename: 'index_JP.html',
      //   template: 'views/index.pug',
      //   chunks: ['app_JP', 'index'],
      //   chunksSortMode: (a, b) => (a.names[0] === 'index' ? 1 : 0),
      // }),


      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.$': 'jquery',
        'window.jQuery': 'jquery',
        MicroModal: 'micromodal',
      }),
      new WebpackNotifierPlugin({
        title: 'Village House',
      }),
    ],
  };

  config.plugins.push(
    ...utils.pages(env),
  );
  
  if (!devMode) {
    config.plugins.push(
      new MinifyPlugin(),
    );
  }
  return config;
};
