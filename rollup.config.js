
const EXTERNAL_GLOBALS = {
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
    external: Object.keys(EXTERNAL_GLOBALS)
  },

  // IIFE
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.global.js',
      format: 'iife',
      name: 'FullCalendar.Vue',
      exports: 'named',
      globals: EXTERNAL_GLOBALS
    },
    external: Object.keys(EXTERNAL_GLOBALS)
  },
]
