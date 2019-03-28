import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

/*
Will generate a UMD by default but can be instructed to generate an ES module
by using command line argument overrides.

Concept derived from:
https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html
*/

const BROWSER_GLOBAL = 'FullCalendarVue'
const EXTERNAL_BROWSER_GLOBALS = {
  '@fullcalendar/core': 'FullCalendar'
}

export default {
  input: 'src/main.js',
  output: {
    format: 'umd',
    file: 'dist/main.umd.js',
    exports: 'named',
    name: BROWSER_GLOBAL,
    globals: EXTERNAL_BROWSER_GLOBALS
  },
  external: Object.keys(EXTERNAL_BROWSER_GLOBALS),
  plugins: [
    resolve({
      jail: 'src' // any files outside of here are considered external libs
    }),
    buble({ // transpile to ES5
      transforms: {
        dangerousForOf: true // allow for...in loops
      }
    })
  ]
}
