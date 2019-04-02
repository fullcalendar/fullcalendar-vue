import { Calendar } from '@fullcalendar/core'
import { INPUT_DEFS, EVENT_NAMES } from './fullcalendar-options'

export default {
  props: INPUT_DEFS,
  calendar: null, // accessed via this.$options.calendar

  render(createElement) {
    return createElement('div')
  },

  mounted() {
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
      return { ...this.fullCalendarInputs, ...this.fullCalendarEvents }
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
    fullCalendarEvents() {
      let handlerHash = {}

      for (let eventName of EVENT_NAMES) {
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
