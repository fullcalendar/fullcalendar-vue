import pkgJson from './package.json'

const [ourPkgNames, otherPkgNames] = getDepNames()
const externalGlobals = {
  vue: 'Vue',
  '@fullcalendar/core': 'FullCalendar',
  '@fullcalendar/core/internal': 'FullCalendar.Internal'
}

export default [
  // CJS
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      externalizePkgsPlugin(ourPkgNames, '.cjs'),
      externalizePkgsPlugin(otherPkgNames),
    ],
  },

  // IIFE
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.global.js',
      format: 'iife',
      name: 'FullCalendar.Vue',
      exports: 'named',
      globals: externalGlobals
    },
    plugins: [
      externalizePkgsPlugin(ourPkgNames),
      externalizePkgsPlugin(otherPkgNames),
    ],
  },
]

// plugins & utils
// -------------------------------------------------------------------------------------------------

function getDepNames() {
  const pkgNames = Object.keys({
    ...pkgJson.dependencies,
    ...pkgJson.peerDependencies,
    ...pkgJson.optionalDependencies,
  })
  const ourPkgNames = []
  const otherPkgNames = []

  for (const pkgName of pkgNames) {
    if (pkgName.match(/^@fullcalendar\//)) {
      ourPkgNames.push(pkgName)
    } else {
      otherPkgNames.push(pkgName)
    }
  }

  return [ourPkgNames, otherPkgNames]
}

function externalizePkgsPlugin(pkgNames, forceExtension) {
  return {
    name: 'externalize-pkgs',
    resolveId(importId) {
      if (!isImportRelative(importId)) {
        for (const pkgName of pkgNames) {
          if (importId === pkgName || importId.startsWith(pkgName + '/')) {
            if (forceExtension) {
              if (importId === pkgName) {
                importId += '/index' + forceExtension
              } else {
                importId += forceExtension
              }
            }
            return { id: importId, external: true }
          }
        }
      }
    },
  }
}

function isImportRelative(importId) {
  return importId.startsWith('./') || importId.startsWith('../')
}
