import Vue, { VNode, PropType } from 'vue'
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { createPlugin } from '@fullcalendar/core'


/*
wrap it in an object with a `vue` key, which the custom content-type handler system will look for
*/
export function wrapVDomGenerator(vDomGenerator: NormalizedScopedSlot) {
  return function(props: any) {
    return { vue: vDomGenerator(props) }
  }
}


export const VueContentTypePlugin = createPlugin({
  contentTypeHandlers: {
    vue: buildVDomHandler // looks for the `vue` key
  }
})


function buildVDomHandler() {
  let currentEl: HTMLElement
  let v: ReturnType<typeof initVue> // the Vue instance

  return function(el: HTMLElement, vDomContent: VNode[]) { // the handler

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


function initVue(initialContent: VNode[]) {
  return new Vue({
    props: {
      content: Array as PropType<VNode[]>
    },
    propsData: {
      content: initialContent
    },
    render(h) {
      let { content } = this

      // the slot result can be an array, but the returned value of a vue component's
      // render method must be a single node.
      if (content.length === 1) {
        return content[0]

      } else {
        return h('span', {}, content)
      }
    }
  })
}
