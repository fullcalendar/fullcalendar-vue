import { Calendar } from '@fullcalendar/core'
import { COMPLEX_OPTIONS } from './fullcalendar-options'
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
    // the root options handler. won't get fired when nested objects are mutated but root is not
    options(options, oldOptions) {
      let diff = diffProps(oldOptions, options)

      if (diff.anyChanges) {
        let calendar = this.getApi()
        calendar.pauseRendering()
        calendar.mutateOptions(diff.updates, diff.removals)

        this.renderId++ // will queue a rerender
      }
    }
  }

  for (let complexOptionName of COMPLEX_OPTIONS) {

    // handlers called when nested objects change
    watchers[`options.${complexOptionName}`] = {
      deep: true,
      handler(val) {
        // unfortunately the handler is called with undefined if new props were set, but the complex one wasn't ever set
        if (val !== undefined) {

          let calendar = this.getApi()
          calendar.pauseRendering()
          calendar.mutateOptions({
            // the only reason we shallow-copy is to trick FC into knowing there's a change when nested values change but the reference doesn't.
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
