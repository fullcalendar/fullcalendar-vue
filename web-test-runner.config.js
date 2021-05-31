const { fromRollup } = require('@web/dev-server-rollup')
const postcss = fromRollup(require('rollup-plugin-postcss'))
const vue = fromRollup(require('rollup-plugin-vue'))
const replace = fromRollup(require('rollup-plugin-replace'))
const alias = fromRollup(require('@rollup/plugin-alias')) // TODO: have other plugins use new

module.exports = {
  nodeResolve: true,
  preserveSymlinks: true,
  files: [
    './tests/main.js',
  ],
  mimeTypes: {
    '**/*.css': 'js', // tell the server to serve css files as js
  },
  plugins: [
    postcss({ inject: true }), // js will inject styles into page
    alias({
      entries: {
        'vue': 'vue/dist/vue.esm-bundler.js' // works? why still the warning about esm-bundler
      }
    }),
    vue(),
    replace({ // needed anymore?
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    })
  ],
}
