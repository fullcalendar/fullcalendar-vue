import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
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

export default {
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
    commonjs(), // allows importing of external cjs modules
    babel(), // will automatically use babel.config.js
    ...(isDev ? [ sourcemaps() ] : [])
  ]
}

function buildBanner() {
  return '/*\n' +
    packageConfig.title + ' v' + packageConfig.version + '\n' +
    'Docs: ' + packageConfig.docs + '\n' +
    'License: ' + packageConfig.license + '\n' +
    '*/'
}
