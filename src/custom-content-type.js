import Vue from 'vue'
import { createPlugin } from '@fullcalendar/core'


/*
wrap it in an object with a `vue` key, which the custom content-type handler system will look for
*/
export function wrapVDomGenerator(vDomGenerator) {
  return function() {
    return { vue: vDomGenerator.apply(this, arguments) }
  }
}


export const VueContentTypePlugin = createPlugin({
  contentTypeHandlers: {
    vue: buildVDomHandler // looks for the `vue` key
  }
})


function buildVDomHandler() {
  let currentEl
  let v // the Vue instance

  return function(el, vDomContent) { // the handler

    if (currentEl !== el) {
      if (currentEl && v) { // if changing elements, recreate the vue
        v.$destroy()
      }
      currentEl = el
    }

    if (!v) {
      v = initVue(vDomContent)

      // vue's mount method *replaces* the given element. create an artificial inner el
      let innerEl = document.createElement('span')
      el.appendChild(innerEl)
      v.$mount(innerEl)

    } else {
      v.content = vDomContent
    }
  }
}


function initVue(initialContent) {
  return new Vue({
    props: [ 'content' ],
    propsData: {
      content: initialContent
    },
    render(h) {
      let { content } = this

      // the slot result can be an array, but the returned value of a vue component's
      // render method must be a single node.
      if (content.length === 1) {
        return content[0]

      } else if (content.length) {
        return h('span', {}, content)
      }
    }
  })
}
