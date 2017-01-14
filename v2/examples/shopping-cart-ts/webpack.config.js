const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: [
      '', '.js', '.ts', '.tsx',
    ],
    alias: {
      slux: path.join(__dirname, '..', '..'),
    },
  },

  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.tsx',
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  module: {
    loaders: [
      {
        test: /.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
};
