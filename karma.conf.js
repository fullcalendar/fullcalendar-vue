
module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: [ 'jasmine' ],
    files: [
      'tests/main.js'
    ],
    preprocessors: {
      'tests/main.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map', // output an inline sourcemap. gets fed into karma-sourcemap-loader
      resolve: {
        extensions: [ '.js' ]
      },
      module: {
        rules: [
          {
            test: /\.js$/, // for fullcalendar lib files. TODO: exclude @vue/test-utils
            use: 'source-map-loader'
          },
          {
            test: /[\/]tests[\/][^.]*\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [ '@babel/preset-env' ],
                plugins: [ '@babel/plugin-transform-runtime' ] // for async keyword
              }
            }
          },
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          }
        ]
      }
    },
    logLevel: config.LOG_INFO,
    reporters: [ 'spec' ]
  })
}
