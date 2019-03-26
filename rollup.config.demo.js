import vue from 'rollup-plugin-vue' // Handle .vue SFC files
import buble from 'rollup-plugin-buble' // Transpile/polyfill with reasonable browser support
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import postcssImport from 'postcss-import'
import replace from 'rollup-plugin-replace'

export default {
  input: 'demo/main.js', // Path relative to package.json
  output: {
    dir: 'demo/built',
    format: 'iife'
  },
  plugins: [
    resolve(),
    replace({ // for https://github.com/rollup/rollup/issues/208
      'process.env.NODE_ENV': "'development'"
    }),
    commonjs({ // needed for demo!!! for default export or something
      namedExports: {
        'node_modules/@fullcalendar/core/main.js': [ 'Calendar' ] // ahhhhhh
      }
    }),
    vue({
      css: false, // DONT Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    postcss({
      extract: true,
      plugins: [
        postcssImport
      ]
    }),
    buble({ // Transpile to ES5
      exclude: [
        'node_modules/**'
      ],
      transforms: {
        dangerousForOf: true
      }
    })
  ]
}
