
module.exports = {
  presets: [
    ['@babel/preset-env', {
      // compile to match the env that jest is executing in, to avoid/include certain polyfills
      targets: { node: 'current' }
    }]
  ],
  plugins: [
  ]
}
