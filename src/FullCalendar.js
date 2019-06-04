import deepEqual from 'fast-deep-equal'
import deepCopy from 'deep-copy'
import { Calendar } from '@fullcalendar/core'
import { PROP_DEFS, PROP_IS_DEEP, EMISSION_NAMES, EMISSION_USE_PROP } from './fullcalendar-options'

/*
VOCAB:
"props" are the values passed in from the parent (they are NOT listeners/emissions)
"emissions" are another way to say "events that will fire"
"options" are the options that the FullCalendar API accepts

NOTE: "deep" props are complex objects that we want to watch for internal changes.
Vue allows a reference to be internally mutated. Each time we detect a mutation,
we use deepCopy to freeze the state. This has the added benefit of stripping the
getter/setter methods that Vue embeds.
*/

export default {
  props: PROP_DEFS,

  // INTERNALS
  // this.$options.calendar
  // this.$options.dirtyOptions - undefined means not ready to accept rerenders

  data() {
    return { renderId: 0 }
  },

  render(createElement) {
    return createElement('div', { attrs: { 'data-fc-render-id': this.renderId } })
  },

  mounted() {
    warnDeprecatedListeners(this.$listeners)

    this.$options.calendar = new Calendar(this.$el, this.buildOptions())
    this.$options.calendar.render()

    this.$options.dirtyOptions = {} // start accepting rerenders
  },

  beforeUpdate() {
    this.renderDirty()
  },

  beforeDestroy() {
    this.$options.calendar.destroy()
  },

  watch: buildWatchers(),

  methods: {

    buildOptions() {
      let options = {}

      for (let emissionName of EMISSION_NAMES) {
        options[emissionName] = (...args) => {
          this.$emit(emissionName, ...args)
        }
      }

      // do after emissions. these props will override emissions with same name
      for (let propName in PROP_DEFS) {
        let propVal = this[propName]

        // protect against undefined because both FullCalendar AND deepCopy choke
        if (propVal !== undefined) {
          options[propName] = PROP_IS_DEEP[propName]
            ? deepCopy(propVal)
            : propVal
        }
      }

      return options
    },

    recordDirtyOption(optionName, newVal) {
      let { dirtyOptions } = this.$options

      if (dirtyOptions) {
        dirtyOptions[optionName] = newVal
        this.renderId++
      }
    },

    renderDirty() {
      let { dirtyOptions } = this.$options

      if (dirtyOptions && Object.keys(dirtyOptions).length > 0) {
        this.$options.dirtyOptions = {} // clear before rendering. might trigger new dirtiness
        this.$options.calendar.mutateOptions(dirtyOptions, [], false, deepEqual)
      }
    },

    getApi() {
      return this.$options.calendar
    }

  }

}


function buildWatchers() {
  let watchers = {}

  for (let propName in PROP_DEFS) {

    if (PROP_IS_DEEP[propName]) {
      watchers[propName] = {
        deep: true, // listen to children as well
        handler(newVal) {
          this.recordDirtyOption(propName, deepCopy(newVal))
        }
      }
    } else {
      watchers[propName] = function(newVal) {
        this.recordDirtyOption(propName, newVal)
      }
    }
  }

  return watchers
}


function warnDeprecatedListeners(listenerHash) {
  for (let emissionName in listenerHash) {
    if (EMISSION_USE_PROP[emissionName]) {
      console.warn('Use of ' + emissionName + ' as an event is deprecated. Please convert to a prop.')
    }
  }
}
