import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import packageConfig from './package.json'

let isDev
if (!/^(development|production)$/.test(process.env.BUILD)) {
  console.warn('BUILD environment not specified. Assuming \'development\'')
  isDev = true
} else {
  isDev = process.env.BUILD === 'development'
}

export default [
  {
    input: 'src/install.js',
    output: {
      format: 'es',
      file: 'dist/main.js',
      banner: buildBanner,
      sourcemap: isDev
    },
    external: Object.keys({
      ...packageConfig.dependencies,
      ...packageConfig.peerDependencies
    }),
    plugins: [
      nodeResolve({ jail: 'src' }), // any files outside of here are considered external libs
      babel() // will automatically use babel.config.js
    ]
  },
  {
    input: 'tests/main.js',
    output: {
      format: 'iife',
      file: 'tmp/tests.js',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs({ // for importing commonjs modules
        namedExports: {
          '@vue/test-utils': [ 'mount' ]
        }
      }),
      replace({
        values: {
          'process.env.NODE_ENV': '"production"'
        }
      }),
      json(), // for some reason vue-template-extractor needs to parse a json file
      postcss({ extract: true })
    ]
  }
]

function buildBanner() {
  return '/*\n' +
    packageConfig.title + ' v' + packageConfig.version + '\n' +
    'Docs: ' + packageConfig.docs + '\n' +
    'License: ' + packageConfig.license + '\n' +
    '*/'
}
