import deepEqual from 'fast-deep-equal'
import { Calendar } from '@fullcalendar/core'
import { deepCopy, mapHash } from './utils'
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
  // this.$options.deepCopies - all current deep options
  // this.$options.dirtyOptions - null/undefined means nothing dirty

  data() {
    return { renderId: 0, deepCopies: {} }
  },

  render(createElement) {
    return createElement('div', {
      // when renderId is changed, Vue will trigger a real-DOM async rerender, calling beforeUpdate/updated
      attrs: { 'data-fc-render-id': this.renderId }
    })
  },

  mounted() {
    warnDeprecatedListeners(this.$listeners)

    this.$options.calendar = new Calendar(this.$el, this.buildCalendarOptions())
    this.$options.calendar.render()
  },

  beforeUpdate() {
    this.renderDirty()
  },

  beforeDestroy() {
    this.$options.calendar.destroy()
  },

  watch: mapHash(PROP_DEFS, buildPropWatcher),

  methods: {

    buildCalendarOptions() {
      let options = {}

      for (let emissionName of EMISSION_NAMES) {
        options[emissionName] = (...args) => {
          this.$emit(emissionName, ...args)
        }
      }

      // do after emissions. these props will override emissions with same name
      for (let propName in PROP_DEFS) {
        let propVal = this[propName]

        // protect against FullCalendar choking on undefined options
        if (propVal !== undefined) {

          if (PROP_IS_DEEP[propName]) {
            propVal = deepCopy(propVal) // freeze state
            this.deepCopies[propName] = propVal // side effect!
          }

          options[propName] = propVal
        }
      }

      return options
    },

    recordDirtyOption(optionName, newVal) {
      ;(this.$options.dirtyOptions || (this.$options.dirtyOptions = {}))[optionName] = newVal
      this.renderId++ // triggers a render eventually
    },

    renderDirty() {
      let { dirtyOptions } = this.$options

      if (dirtyOptions) {
        this.$options.dirtyOptions = null // clear before rendering. might trigger new dirtiness
        this.$options.calendar.mutateOptions(dirtyOptions, [], false, deepEqual)
      }
    },

    getApi() {
      return this.$options.calendar
    }

  }

}


function buildPropWatcher(propDef, propName) {
  if (PROP_IS_DEEP[propName]) {
    return {
      deep: true, // listen to children as well
      handler(newVal) {
        // use this instead of the handler's param because if same reference, will always be equal
        let oldVal = this.deepCopies[propName]

        if (!deepEqual(newVal, oldVal)) {
          newVal = deepCopy(newVal) // freeze state
          this.deepCopies[propName] = newVal // always keep this up to date
          this.recordDirtyOption(propName, newVal)
        }
      }
    }
  } else {
    return function(newVal) {
      this.recordDirtyOption(propName, newVal)
    }
  }
}


function warnDeprecatedListeners(listenerHash) {
  for (let emissionName in listenerHash) {
    if (EMISSION_USE_PROP[emissionName]) {
      console.warn('Use of ' + emissionName + ' as an event is deprecated. Please convert to a prop.')
    }
  }
}
