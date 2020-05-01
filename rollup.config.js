import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import postcss from 'rollup-plugin-postcss'
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
      babel(), // will automatically use babel.config.js
      sourcemaps()
    ]
  },
  {
    input: 'tests/main.js',
    output: {
      format: 'iife',
      file: 'tmp/tests.js',
      sourcemap: true,
      globals: {
        '@vue/test-utils': 'VueTestUtils' // TODO: problems with rollup parsing cjs module. in karma, include with node_modules/@vue/test-utils/dist/vue-test-utils.umd.js
      }
    },
    external: [
      '@vue/test-utils'
    ],
    plugins: [
      nodeResolve(),
      postcss({ extract: true }),
      sourcemaps()
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
