import { Calendar } from '@fullcalendar/core'
import { COMPLEX_OPTIONS } from './fullcalendar-options'


export default {
  props: [ 'options' ],
  data() {
    return {
      renderId: 0
    }
  },
  render(createElement) {
    return createElement('div', {
      // when renderId is changed, Vue will trigger a real-DOM async rerender, calling beforeUpdate/updated
      attrs: { 'data-fc-render-id': this.renderId }
    })
  },
  mounted() {
    this.$options.calendar = new Calendar(this.$el, this.options)
    this.$options.calendar.render()
  },
  methods: {
    getApi() {
      return this.$options.calendar
    }
  },
  beforeUpdate() {
    this.getApi().resumeRendering() // the watcher paused it
  },
  beforeDestroy() {
    this.getApi().destroy()
  },
  watch: buildWatchers()
}


function buildWatchers() {
  let watchers = {
    options(options, oldOptions) {
      let calendar = this.getApi()
      calendar.pauseRendering()
      calendar.resetOptions(options, oldOptions)
      this.renderId++
    }
  }

  for (let complexOptionName of COMPLEX_OPTIONS) {
    watchers[`options.${complexOptionName}`] = {
      deep: true,
      handler(val) {
        if (val !== undefined) { // when option is not specified in an update, given as undefined
          let calendar = this.getApi()
          calendar.pauseRendering()
          this.getApi().mutateOptions({
            [complexOptionName]: copyTopLevel(val) // the copy will cache-bust internal purecomponents
          })
          this.renderId++
        }
      }
    }
  }

  return watchers
}


function copyTopLevel(val) {
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      val = Array.prototype.slice.call(val)
    } else if (val) { // non-null
      val = { ...val }
    }
  }
  return val
}
