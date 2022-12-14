const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

/*
Tests
*/
module.exports = () => ({
  mode: 'development',
  devtool: 'inline-source-map', // gets fed into karma-sourcemap-loader
  resolve: {
    extensions: ['.js']
  },
  entry: './tests/index.js',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
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
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'] // for async keyword
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  output: {
    path: path.join(__dirname, 'tests/dist'), // directory
    filename: 'index.js'
  }
})
