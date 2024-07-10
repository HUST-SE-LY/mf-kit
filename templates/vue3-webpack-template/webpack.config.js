const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');

module.exports = (env = {}) => ({
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  externals: {
    vue: 'Vue',
  },
  target: 'web',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    publicPath: 'http://localhost:3000/',
  },
  resolve: {
    extensions: ['.vue', '.jsx', '.js', '.json', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json'),
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader', 'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      chunks: ['main'],
    }),
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'container',
      filename: 'remoteEntry.js',
      dts: {
        generateTypes: {
          compilerInstance: 'vue-tsc'
        }
      }
    }),
  ],
  devServer: {
    port: 3000,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
});