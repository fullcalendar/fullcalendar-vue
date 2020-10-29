const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = (env) => ({
  mode: 'development',
  devtool: 'inline-source-map', // output an inline sourcemap. gets fed into karma-sourcemap-loader
  resolve: {
    extensions: [ '.js' ]
  },
  entry: './tests/main.js',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false // solves annoying errors about extensions. REVISIT
        }
      },
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
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  output: {
    path: path.join(__dirname, 'tmp/compiled-tests')
  }
})
