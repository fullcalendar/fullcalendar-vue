import Vue, { VNode } from 'vue'
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { createPlugin, PluginDef } from '@fullcalendar/core'


/*
wrap it in an object with a `vue` key, which the custom content-type handler system will look for
*/
export function wrapVDomGenerator(vDomGenerator: NormalizedScopedSlot) {
  return function(props: any) {
    return { vue: vDomGenerator(props) }
  }
}

export function createVueContentTypePlugin(parent: Vue): PluginDef {
  return createPlugin({
    contentTypeHandlers: {
      vue: () => buildVDomHandler(parent), // looks for the `vue` key
    }
  });
}


function buildVDomHandler(parent: Vue) {
  let currentEl: HTMLElement
  let v: ReturnType<typeof initVue> // the Vue instance

  function render(el: HTMLElement, vDomContent: VNode[]) { // the handler
    if (currentEl !== el) {
      if (currentEl && v) { // if changing elements, recreate the vue
        v.$destroy()
      }
      currentEl = el
    }

    if (!v) {
      v = initVue(vDomContent, parent)

      // vue's mount method *replaces* the given element. create an artificial inner el
      let innerEl = document.createElement('span')
      el.appendChild(innerEl)
      v.$mount(innerEl)
    } else {
      v.content = vDomContent
    }
  }

  function destroy() {
    if (v) { // needed?
      v.$destroy()
    }
  }

  return { render, destroy }
}

function initVue(initialContent: VNode[], parent: Vue) {
  return new Vue({
    parent,
    data: {
      content: initialContent,
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
