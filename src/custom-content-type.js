import Vue from 'vue' // TODO: global var for rollup
import { createPlugin } from '@fullcalendar/core'


export function wrapVDomGenerator(vDomGenerator) {
  return function() {
    return { vue: vDomGenerator.apply(this, arguments) }
  }
}


export const VueContentTypePlugin = createPlugin({
  contentTypeHandlers: {
    vue: buildVDomHandler
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
      v = new Vue({
        render(h) {
          // the slot result can be an array, but the returned value of a vue component's
          // render method must be a single node.
          if (vDomContent.length === 1) {
            return vDomContent[0]

          } else if (vDomContent.length) {
            return h('span', {}, vDomContent)
          }
        }
      })

      // vue's mount method *replaces* the given element. create an artificial inner el
      let innerEl = document.createElement('span')
      el.appendChild(innerEl)
      v.$mount(innerEl)

    } else {
      v.$forceUpdate() // will call render again, which will have the updated vDomContent
    }
  }
}
