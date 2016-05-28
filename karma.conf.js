/* eslint-disable no-var, func-names */
// Karma configuration
var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',

    port: 33339,

    frameworks: ['jasmine', 'sinon'],

    files: [
      'test/index.js',
    ],

    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },

    webpack: {
      // webpack configuration
      devtool: '#inline-source-map',

      resolve: {
        extensions: ['', '.js', '.jsx'],
      },

      babel: {
        presets: ['react', 'es2015', 'stage-0'],
      },

      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
          presets: ['react', 'es2015', 'stage-0'],
        },
      },

      module: {
        preLoaders: [
          // transpile all files except testing sources with babel as usual
          {
            test: /\.jsx?$/,
            exclude: [
              path.resolve('lib/'),
              path.resolve('node_modules/'),
            ],
            loader: 'babel',
          },
          // transpile and instrument only testing sources with isparta
          {
            test: /\.jsx?$/,
            include: path.resolve('lib/'),
            loader: 'isparta',
          },
        ],
      },
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      noInfo: true,
    },

    reporters: ['spec', 'jasmine-diff', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'lcov' },
      ],
    },

    logLevel: config.LOG_INFO,

    browsers: ['PhantomJS'],

  });
};
