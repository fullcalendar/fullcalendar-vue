import vue from '@vitejs/plugin-vue'
import sourcemaps from 'rollup-plugin-sourcemaps'

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
      fileName: 'index',
      formats: ['iife'], // produces .iife.js
      name: 'FullCalendarVueTests' // necessary, but not used
    },
    minify: false
  },
  plugins: [
    vue(),
    sourcemaps() // for READING sourcemaps
  ]
}
