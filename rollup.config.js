import componentConfig from './rollup.config.component'
import demoConfig from './rollup.config.demo'

/*
This config lets us generate/watch the demo project AND the component dist files
*/

export default [].concat(
  componentConfig,
  demoConfig
)
