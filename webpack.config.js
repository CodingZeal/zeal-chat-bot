const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'none',
  target: 'node',
  plugins: [new CleanWebpackPlugin()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
