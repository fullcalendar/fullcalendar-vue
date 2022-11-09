import Vue from 'vue'

let multiRootWarned = false

const Teleport = Vue.extend({
  props: {
    to: HTMLElement
  },

  render(createElement) {
    const childVNodes = this.$slots.default || []

    if (childVNodes.length !== 1) {
      if (!multiRootWarned) {
        multiRootWarned = true
        console.warn(
          'FullCalendar slots should return a single root element.\n' +
          'Wrapping in a <span> as a workaround'
        )
      }

      return createElement('span', childVNodes)
    }

    return childVNodes[0]
  },

  mounted() {
    this.to.appendChild(this.$el)
  }
})

export default Teleport
