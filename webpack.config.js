const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './tests/main.js',
  output: {
    path: path.join(__dirname, 'tmp'),
    filename: 'tests.js'
  },
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
            presets: [ '@babel/preset-env' ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}
