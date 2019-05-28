import { Calendar } from '@fullcalendar/core'
import { INPUT_DEFS, EMISSIONS, EMISSIONS_USE_INPUT } from './fullcalendar-options'

export default {
  props: INPUT_DEFS,
  calendar: null, // accessed via this.$options.calendar

  render(createElement) {
    return createElement('div')
  },

  mounted() {
    warnDeprecatedListeners(this.$listeners)

    this.$options.calendar = new Calendar(this.$el, this.fullCalendarOptions)
    this.$options.calendar.render()
  },

  beforeDestroy() {
    this.$options.calendar.destroy()
  },

  watch: {
    fullCalendarOptions(options) {
      this.$options.calendar.resetOptions(options)
    }
  },

  computed: {
    fullCalendarOptions() {
      return {
        ...this.fullCalendarEmissions,
        ...this.fullCalendarInputs // needs to take precedence over fullCalendarEmissions, for EMISSIONS_USE_INPUT
      }
    },
    fullCalendarInputs() {
      let inputHash = {}

      for (let inputName in INPUT_DEFS) {
        let val = this[inputName]

        if (val !== undefined) { // unfortunately FC chokes when some props are set to undefined
          inputHash[inputName] = val
        }
      }

      return inputHash
    },
    fullCalendarEmissions() {
      let handlerHash = {}

      for (let eventName of EMISSIONS) {
        handlerHash[eventName] = (...args) => {
          this.$emit(eventName, ...args)
        }
      }

      return handlerHash
    }
  },

  methods: {
    getApi() {
      return this.$options.calendar
    }
  }

}

function warnDeprecatedListeners(listenerHash) {
  for (let emissionName in listenerHash) {
    if (EMISSIONS_USE_INPUT[emissionName]) {
      console.warn('Use of ' + emissionName + ' as an event is deprecated. Please convert to a prop.')
    }
  }
}
