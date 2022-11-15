import vue from '@vitejs/plugin-vue'

/*
Tests
*/
export default {
  root: './tests/', // all other paths are relative to this
  build: {
    sourcemap: 'inline', // gets fed into karma-sourcemap-loader
    lib: {
      entry: 'index.js',
      name: 'FullCalendarVueTests', // necessary, but not used
      formats: ['iife'],
      fileName: 'tests'
    }
  },
  plugins: [
    vue()
  ]
}
