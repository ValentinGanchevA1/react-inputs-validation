const webpack = require('webpack');
const path = require('path');
const PATH = require('./build_path');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  context: PATH.ROOT_PATH,
  entry: {
    index: PATH.ROOT_PATH + 'example/index.js',
    // index: PATH.ROOT_PATH + 'example/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.mp3?$/,
        include: [PATH.ROOT_PATH],
        exclude: [PATH.NODE_MODULES_PATH],
        loader: 'file-loader?name=audio/[name]-[hash].[ext]',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
        include: [PATH.ROOT_PATH],
        // exclude: [PATH.NODE_MODULES_PATH],
        loader: 'url-loader?limit=1&name=font/[name]-[hash].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        include: [PATH.ROOT_PATH],
        // exclude: [PATH.NODE_MODULES_PATH],
        loader: 'url-loader?limit=1&name=img/[name]-[hash].[ext]',
      },
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        exclude: [PATH.NODE_MODULES_PATH],
        use: [
          {
            loader: 'tslint-loader',
            options: {
              // emitWarning: true
            },
          },
        ],
      },
      { test: /\.(ts|tsx)$/, loader: 'awesome-typescript-loader' },
      {
        test: /\.jsx?$/,
        include: [PATH.ROOT_PATH],
        exclude: [PATH.NODE_MODULES_PATH],
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.jsx?$/,
        include: [PATH.ROOT_PATH],
        exclude: [PATH.NODE_MODULES_PATH],
        enforce: 'post',
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: [PATH.NODE_MODULES_PATH],
        // exclude: [PATH.ROOT_PATH],
        enforce: 'post',
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-import')({
                  root: loader.resourcePath,
                }),
                require('autoprefixer')(),
                require('cssnano')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: [PATH.ROOT_PATH + 'lib'],
        // exclude: [PATH.ROOT_PATH],
        enforce: 'post',
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-import')({
                  root: loader.resourcePath,
                }),
                require('autoprefixer')(),
                require('cssnano')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: [PATH.SOURCE_PATH],
        exclude: [PATH.NODE_MODULES_PATH],
        enforce: 'post',
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-import')({
                  root: loader.resourcePath,
                }),
                require('autoprefixer')(),
                require('cssnano')({ safe: true }),
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        oneOf: [
          /* rules */
        ],
      },
      // only use one of these nested rules

      {
        rules: [
          /* rules */
        ],
      },
      // use all of these nested rules (combine with conditions to be useful)

      {
        resource: {
          and: [
            /* conditions */
          ],
        },
      },
      // matches only if all conditions are matched

      {
        resource: {
          or: [
            /* conditions */
          ],
        },
      },
      {
        resource: [
          /* conditions */
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.css'],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 9000,
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
    new webpack.ProvidePlugin({
      React: 'React',
      react: 'React',
      'window.react': 'React',
      'window.React': 'React',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new WebpackAssetsManifest({
      fileName: 'manifest-rev.json',
    }),
  ],
};
