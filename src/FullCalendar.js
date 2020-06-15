import { Calendar } from '@fullcalendar/core'
import { OPTION_IS_COMPLEX } from './options'
import { shallowCopy, mapHash } from './utils'
import { wrapVDomGenerator, VueContentTypePlugin } from './custom-content-type'


/*
IMPORTANT NOTE: `this.$options` is merely a place to store internal state.
The `this.options` prop holds the FullCalendar options.
*/
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
    this.$options.scopedSlotOptions = mapHash(this.$scopedSlots, wrapVDomGenerator) // needed for buildOptions
    let calendar = this.$options.calendar = new Calendar(this.$el, this.buildOptions(this.options))
    calendar.render()
  },

  methods: {

    buildOptions(suppliedOptions) {
      suppliedOptions = suppliedOptions || {}
      return {
        ...this.$options.scopedSlotOptions,
        ...suppliedOptions, // spread will pull out the values from the options getter functions
        plugins: (suppliedOptions.plugins || []).concat([
          VueContentTypePlugin
        ])
      }
    },

    getApi() {
      return this.$options.calendar
    }

  },

  beforeUpdate() {
    this.getApi().resumeRendering() // the watcher handlers paused it
  },

  beforeDestroy() {
    this.getApi().destroy()
  },

  watch: buildWatchers()
}


function buildWatchers() {

  let watchers = {

    // watches changes of ALL options and their nested objects,
    // but this is only a means to be notified of top-level non-complex options changes.
    options: {
      deep: true,
      handler(options) {
        let calendar = this.getApi()
        calendar.pauseRendering()
        calendar.resetOptions(this.buildOptions(options))
        this.renderId++ // will queue a rerender
      }
    }
  }

  for (let complexOptionName in OPTION_IS_COMPLEX) {

    // handlers called when nested objects change
    watchers[`options.${complexOptionName}`] = {
      deep: true,
      handler(val) {

        // unfortunately the handler is called with undefined if new props were set, but the complex one wasn't ever set
        if (val !== undefined) {

          let calendar = this.getApi()
          calendar.pauseRendering()
          calendar.resetOptions({
            // the only reason we shallow-copy is to trick FC into knowing there's a nested change.
            // TODO: future versions of FC will more gracefully handle event option-changes that are same-reference.
            [complexOptionName]: shallowCopy(val)
          }, true)

          this.renderId++ // will queue a rerender
        }
      }
    }
  }

  return watchers
}
