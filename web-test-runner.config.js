const { fromRollup } = require('@web/dev-server-rollup')
const alias = fromRollup(require('@rollup/plugin-alias'))
const replace = fromRollup(require('@rollup/plugin-replace'))
const vue = fromRollup(require('rollup-plugin-vue'))
const postcss = fromRollup(require('rollup-plugin-postcss'))

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
    alias({
      entries: {
        // use the Vue build that does runtime compilation of templates
        'vue': 'vue/dist/vue.esm-bundler.js',
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser'),

      // recommended build flags. also, when defined, quiets template warning
      // https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,

      // build flags for i18n plugin. doesn't quiet all warnings unfortunately
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: true, // TODO: flip off!!! fix!!!
      __VUE_I18N_PROD_DEVTOOLS__: false,
    }),
    postcss({
      inject: true, // js will inject styles into page
    }),
    vue(),
  ],
}
