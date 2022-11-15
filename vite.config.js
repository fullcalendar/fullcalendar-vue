import vue from '@vitejs/plugin-vue'

/*
Tests
*/
export default {
  root: './tests/', // all other paths are relative to this
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js' // for runtime vue templates
    }
  },
  build: {
    sourcemap: 'inline', // gets fed into karma-sourcemap-loader
    lib: {
      entry: 'index.js',
      name: 'FullCalendarVueTests', // necessary, but not used
      formats: ['iife'], // produces .iife.js
      fileName: 'index'
    },
    minify: false
  },
  plugins: [
    vue()
  ]
}
