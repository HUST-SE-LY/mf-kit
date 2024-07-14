const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced');
const { readFileSync } = require('fs');

const mfConfig = JSON.parse(readFileSync('./mf.config.json', 'utf8'));

module.exports = (env = {}) => ({
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  target: 'web',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    publicPath: `http://localhost:${mfConfig.host.port}/`,
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
      name: 'host',
      filename: 'remoteEntry.js',
      dts: {
        generateTypes: {
          compilerInstance: 'vue-tsc'
        }
      },
      remotes: {
        ...mfConfig.host.curRemotes
      },
      exposes: {
        ...mfConfig.host.exposes,
      },
    }),
  ],
  devServer: {
    port: mfConfig.host.port,
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
});