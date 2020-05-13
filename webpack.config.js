const path = require('path');

module.exports = {
  mode: 'development',
  entry: [path.join(__dirname, 'src', 'client', 'index.tsx')],

  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.join(__dirname, 'src')],
        loader: 'ts-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },

  devtool: 'source-map',
};
