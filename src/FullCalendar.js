import { Calendar } from '@fullcalendar/core'
import { OPTION_IS_COMPLEX } from './fullcalendar-options'
import { shallowCopy, diffProps } from './utils'


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
    this.$options.optionSnapshot = shallowCopy(this.options) // for diffing of non-complex options only
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
        let { optionSnapshot } = this.$options
        let diff = diffProps(optionSnapshot, options)

        if (diff.anyChanges) {

          // update optionSnapshot for next time
          for (let optionName in diff.updates) {
            if (!OPTION_IS_COMPLEX[optionName]) {
              optionSnapshot[optionName] = options[optionName]
            }
          }
          for (let optionName of diff.removals) {
            delete optionSnapshot[optionName]
          }

          let calendar = this.getApi()
          calendar.pauseRendering()
          calendar.mutateOptions(diff.updates, diff.removals)

          this.renderId++ // will queue a rerender
        }
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
          calendar.mutateOptions({
            // the only reason we shallow-copy is to trick FC into knowing there's a nested change.
            // TODO: future versions of FC will more gracefully handle event option-changes that are same-reference.
            [complexOptionName]: shallowCopy(val)
          })

          this.renderId++ // will queue a rerender
        }
      }
    }
  }

  return watchers
}
