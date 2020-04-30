import { Calendar } from '@fullcalendar/core'
import { OPTION_IS_COMPLEX } from './options'
import { shallowCopy, mapHash } from './utils'
import { wrapVDomGenerator, VueContentTypePlugin } from './custom-content-type'


/*
IMPORTANT NOTE: `this.$options` is merely a place to store state.
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
    let options = this.options || {}
    this.$options.calendar = new Calendar(
      this.$el,
      // the snapshot will NOT use this transformed object, so it's okay to inject new values
      buildInitialOptions(options, this.$scopedSlots) // will pull out the values from the options getter functions
    )
    this.$options.calendar.render()
  },

  methods: {
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
        calendar.resetOptions(shallowCopy(options)) // pull out values from getters
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


function buildInitialOptions(options, scopedSlots) {
  return {
    ...options,
    plugins: (options.plugins || []).concat([
      VueContentTypePlugin
    ]),
    ...mapHash(scopedSlots, wrapVDomGenerator)
  }
}
