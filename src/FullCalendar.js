import { default as deepEquals } from 'fast-deep-equal' // TODO: bundle with lib
import { default as deepCopy } from 'deep-copy' // TODO: bundle with lib also?
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
  // this.$options.dirtyOptions - null means no dirty options

  render(createElement) {
    return createElement('div')
  },

  mounted() {
    warnDeprecatedListeners(this.$listeners)

    this.$options.calendar = new Calendar(this.$el, this.buildOptions())
    this.$options.calendar.render()
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

        if (propVal !== undefined) { // NOTE: FullCalendar's API often chokes on undefines
          options[propName] = PROP_IS_DEEP[propName] ?
            deepCopy(propVal) : // NOTE: deepCopy will choke on undefined as well
            propVal
        }
      }

      return options
    },

    renderDirty() {
      let { dirtyOptions } = this.$options

      if (dirtyOptions) {
        this.$options.dirtyOptions = null // clear before rendering. might trigger new dirtiness
        this.$options.calendar.mutateOptions(dirtyOptions, [], false, deepEquals)
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

        handler(newVal, oldVal) {
          recordDirtyOption(this, propName, deepCopy(newVal))

          // if the reference is the same, it's an add, remove, or internal mutation. the beforeUpdate hook WON'T fire.
          // otherwise, the beforeUpdate hook WILL fire and cause a rerender
          if (newVal === oldVal) {
            this.renderDirty()
          }
        }
      }

    } else {

      watchers[propName] = function(newVal) {
        recordDirtyOption(this, propName, newVal) // the beforeUpdate hook will render the dirtiness
      }
    }
  }

  return watchers
}


function recordDirtyOption(vm, optionName, newVal) {
  ;(vm.$options.dirtyOptions || (vm.$options.dirtyOptions = {}))[optionName] = newVal
}


function warnDeprecatedListeners(listenerHash) {
  for (let emissionName in listenerHash) {
    if (EMISSION_USE_PROP[emissionName]) {
      console.warn('Use of ' + emissionName + ' as an event is deprecated. Please convert to a prop.')
    }
  }
}
