import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import resolve from 'rollup-plugin-node-resolve'

// https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html

const UMD_GLOBALS = {
  '@fullcalendar/core': 'FullCalendar'
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.umd.js',
    name: 'FullCalendarVue', // for browser global
    exports: 'named',
    globals: UMD_GLOBALS,
    format: 'umd'
  },
  external: Object.keys(UMD_GLOBALS),
  plugins: [
    resolve({
      jail: 'src' // TODO: use this in core project
    }),
    vue({
      compileTemplate: true // Explicitly convert template to render function
    }),
    buble({ // Transpile to ES5
      transforms: {
        dangerousForOf: true
      }
    })
  ]
}
