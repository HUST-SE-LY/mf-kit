const path = require('path');

module.exports = {
  entry: './src/index.ts', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // 你可以在这里添加更多的加载器配置
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};