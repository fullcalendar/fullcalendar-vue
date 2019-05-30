import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import packageConfig from './package.json'

let isDev
if (!/^(development|production)$/.test(process.env.BUILD)) {
  console.warn('BUILD environment not specified. Assuming \'development\'')
  isDev = true
} else {
  isDev = process.env.BUILD === 'development'
}

let sourcemap = isDev ? 'inline' : false

const BROWSER_GLOBAL = 'FullCalendarVue'
const EXTERNAL_BROWSER_GLOBALS = {
  'deep-copy': 'dcopy',
  'fast-deep-equal': 'fdequal', // isn't true! there is no browser global!
  '@fullcalendar/core': 'FullCalendar'
}
const OUTPUT_SETTINGS = {
  umd: {
    format: 'umd',
    file: 'dist/main.umd.js',
    exports: 'named',
    name: BROWSER_GLOBAL,
    globals: EXTERNAL_BROWSER_GLOBALS,
    banner: buildBanner,
    sourcemap
  },
  esm: {
    format: 'es',
    file: 'dist/main.esm.js',
    banner: buildBanner,
    sourcemap
  }
}

export default [
  buildSettings('umd'),
  buildSettings('esm')
]

function buildSettings(format) {
  let plugins = [
    nodeResolve({
      jail: 'src' // any files outside of here are considered external libs
    }),
    babel() // will automatically use babel.config.js
  ]

  if (isDev) {
    plugins.push(sourcemaps())
  }

  return {
    input: 'src/wrapper.js',
    output: OUTPUT_SETTINGS[format],
    external: Object.keys(EXTERNAL_BROWSER_GLOBALS),
    plugins
  }
}

function buildBanner() {
  return '/*\n' +
    packageConfig.title + ' v' + packageConfig.version + '\n' +
    'Docs: ' + packageConfig.docs + '\n' +
    'License: ' + packageConfig.license + '\n' +
    '*/'
}
