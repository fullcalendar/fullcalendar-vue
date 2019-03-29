import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import'
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/main.js',
  output: {
    dir: 'built',
    format: 'iife'
  },
  plugins: [
    resolve(), // for knowing to include node_modules
    replace({ // vue relies on some node-related globals (https://github.com/rollup/rollup/issues/208)
      'process.env.NODE_ENV': "'development'"
    }),
    commonjs({ // rollup has trouble with UMD. TODO: provide an .esm.js
      namedExports: {
        'node_modules/@fullcalendar/core/main.js': [ 'Calendar' ],
        '../node_modules/@fullcalendar/core/main.js': [ 'Calendar' ]
      }
    }),
    vue({ // handles .vue files
      css: false, // output a normal CSS files. don't let JS inject a <style> tag
      compileTemplate: true // explicitly convert templates to render functions (needs vue-template-compiler)
    }),
    postcss({
      extract: true, // output a normal CSS files. don't let JS inject a <style> tag
      plugins: [ postcssImport ] // for @import functionality
    }),
    buble({ // transpile to ES5
      exclude: [
        'node_modules/**' // couldn't transpile some vue lib files
      ],
      transforms: {
        dangerousForOf: true // allow for...in loops
      }
    })
  ]
}
