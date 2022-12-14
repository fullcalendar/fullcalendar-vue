import Vue from 'vue'

const dummyContainer = document.createDocumentFragment()

const TransportContainer = Vue.extend({
  props: {
    inPlaceOf: Element,
    reportEl: Function, // TODO: better type
    elTag: String,
    elClasses: Array,
    elStyle: Object,
    elAttrs: Object
  },

  render(h) {
    return h(this.elTag, {
      class: this.elClasses,
      style: this.elStyle,
      attrs: this.elAttrs,
    }, this.$slots.default || [])
  },

  mounted() {
    replaceEl(this.$el, this.inPlaceOf)
    this.reportEl(this.$el)
  },

  updated() {
    /*
    If the ContentContainer's tagName changed, it will create a new DOM element in its
    original place. Detect this and re-replace.
    */
    if (this.inPlaceOf.parentNode !== dummyContainer) {
      replaceEl(this.$el, this.inPlaceOf)
      this.reportEl(this.$el)
    }
  },

  beforeDestroy() {
    dummyContainer.removeChild(this.inPlaceOf)
    this.reportEl(null)
  }
})

export default TransportContainer

function replaceEl(subject: Element, inPlaceOf: Element): void {
  inPlaceOf.parentNode?.insertBefore(subject, inPlaceOf.nextSibling)
  dummyContainer.appendChild(inPlaceOf)
}
