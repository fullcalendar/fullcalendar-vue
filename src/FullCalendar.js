import { Calendar } from '@fullcalendar/core'
import { fullCalendarInputNames, fullCalendarEventNames } from './fullcalendar-options'

export default {
  props: fullCalendarInputNames,
  calendar: null, // custom prop accessed via this.$options.calendar

  computed: {

    fullCalendarOptions() {
      return Object.assign({}, this.fullCalendarInputs, this.fullCalendarEvents)
    },

    fullCalendarInputs() {
      let inputHash = {}

      for (let inputName of fullCalendarInputNames) {
        let val = this[inputName]

        if (val !== undefined) { // wish we didn't have to do this
          inputHash[inputName] = val
        }
      }

      return inputHash
    },

    fullCalendarEvents() {
      let handlerHash = {}

      for (let eventName of fullCalendarEventNames) {
        handlerHash[eventName] = (...args) => {
          this.$emit(eventName, ...args)
        }
      }

      return handlerHash
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
