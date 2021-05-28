const { fromRollup } = require('@web/dev-server-rollup')
const postcss = fromRollup(require('rollup-plugin-postcss'))
const vue = fromRollup(require('rollup-plugin-vue'))
const replace = fromRollup(require('rollup-plugin-replace'))

module.exports = {
  watch: true,
  preserveSymlinks: true,
  nodeResolve: true,
  files: [
    './tests/main.js',
  ],
  mimeTypes: {
    '**/*.css': 'js', // tell the server to serve css files as js
  },
  plugins: [
    postcss({ inject: true }), // js will inject styles into page
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    })
  ],
}
