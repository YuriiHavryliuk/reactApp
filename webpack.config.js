const webpack = require('webpack');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const argvs = require('yargs').argv;

const config = {
  'feature-detects': ['input', 'canvas', 'css/resize'],
};

const isDevelopment = argvs.mode === 'development';
const isProduction = !isDevelopment;

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: ['< 1%'],
                }),
                isProduction ? cssnano() : () => {},
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              useRelativePath: true,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 70,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin('dist', {}),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'style.css' : 'style.min.css',
    }),
    new CopyWebpackPlugin([
      {
        from: './src/images',
        to: 'images/',
      },
    ]),
    new ModernizrWebpackPlugin(config),
  ],
  optimization: isProduction
    ? {
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                inline: false,
                drop_console: true,
              },
            },
          }),
        ],
      }
    : {},

  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
