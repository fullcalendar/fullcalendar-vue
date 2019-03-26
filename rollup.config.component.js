import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

const UMD_GLOBALS = { // get this from core project somehow?
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
    commonjs({ // needed for demo!!! for default export or something
      namedExports: {
        'node_modules/@fullcalendar/core/main.js': [ 'Calendar' ] // ahhhhhh
      }
    }),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    buble({ // Transpile to ES5
      transforms: {
        dangerousForOf: true
      }
    })
  ]
}
