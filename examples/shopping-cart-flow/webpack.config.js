const path = require('path');
const webpack = require('webpack');

const babelOptions = {
  presets: [
    'es2015',
    'react',
  ],
  plugins: [
    'transform-object-rest-spread',
    'transform-flow-strip-types',
  ],
};

module.exports = {
  resolve: {
    alias: {
      slux: path.join(__dirname, '..', '..'),
    },
  },

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src'),
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      query: babelOptions,
      include: __dirname,
      exclude: /node_modules/,
    }],
  },
};
