const spawn = require('child_process').spawn;
const colors = require('colors/safe');
const readline = require('readline');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.join(__dirname, '../../src');
const outPath = path.join(__dirname, '../../dist');
const cwd = process.cwd();

class FlowPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, cb, res) => {
      const status = spawn(`${cwd}/node_modules/.bin/flow`, ['status']);
      let result = '';

      status.stdout.on('data', data => {
        result += data.toString();
      });

      status.on('close', code => {
        if (result.indexOf('No errors!') > -1) return false;
        console.log('\n' + colors.rainbow('='.repeat(40)) + '\n');
        console.log(colors.red(result));
        console.log('\n' + colors.rainbow('='.repeat(40)) + '\n');
      });

      cb();
    });
  }
}

const config = {
  module: {
    loaders: [{
      test: /\.css/,
      loaders: ['style', 'css'],
    }, {
      test: /\.js$/,
      exclude: [/elm-stuff/, /node_modules/],
      loader: 'babel',
    }, {
      test: /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      loader: 'elm-webpack',
    }],
  },

  entry: {
    main: path.join(srcPath, '/index.js'),
  },

  output: {
    path: outPath,
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {},

  plugins: [
    new FlowPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      chunks: ['main'],
    }),
  ],

  externals: [],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        unsafe: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        collapse_vars: true,
        negate_iife: true,
        pure_getters: true,
        drop_console: true,
        keep_fargs: false,
      },
      'screw-ie8': true,
      mangle: true,
      stats: true,
    }),
  ]);
}

module.exports = config;
