
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
      devtool: 'inline-source-map', // TODO: only process for our files???
      resolve: {
        extensions: [ '.js' ]
      },
      module: {
        rules: [
          {
            test: /\.js$/,
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
