import { Calendar } from '@fullcalendar/core'
import { INPUT_NAMES, EVENT_NAMES } from './fullcalendar-options'

export default {
  props: INPUT_NAMES,
  calendar: null, // custom prop accessed via this.$options.calendar

  computed: {

    fullCalendarOptions() {
      return Object.assign({}, this.fullCalendarInputs, this.fullCalendarEvents)
    },

    fullCalendarInputs() {
      let inputHash = {}

      for (let inputName of INPUT_NAMES) {
        let val = this[inputName]

        if (val !== undefined) { // wish we didn't have to do this
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

  },

  render(createElement) {
    return createElement('div')
  },

  mounted() {
    this.$options.calendar = new Calendar(this.$el, this.fullCalendarOptions)
    this.$options.calendar.render()
  },

  watch: {
    fullCalendarOptions() {
      this.$options.calendar.destroy()
      this.$options.calendar = new Calendar(this.$el, this.fullCalendarOptions)
      this.$options.calendar.render()
    }
  },

  beforeDestroy() {
    this.$options.calendar.destroy()
    this.$options.calendar = null
  }

}
