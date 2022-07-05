import { VNode, Slot, AppContext, render as vueRender } from 'vue'
import { createPlugin, PluginDef } from '@fullcalendar/core'

/*
wrap it in an object with a `vue` key, which the custom content-type handler system will look for
*/
export function wrapVDomGenerator(vDomGenerator: Slot) {
  return function(props: any) {
    return { vue: vDomGenerator(props) }
  }
}

export function createVueContentTypePlugin(appContext: AppContext): PluginDef {
  return createPlugin({
    contentTypeHandlers: {
      vue: () => buildVDomHandler(appContext), // looks for the `vue` key
    }
  })
}

function buildVDomHandler(appContext: AppContext) {
  let currentEl: HTMLElement

  function render(el: HTMLElement, vDomContent: VNode[]) { // the handler
    if (currentEl !== el) {
      if (currentEl) { // if changing elements, recreate the vue
        vueRender(null, currentEl)
      }
      currentEl = el
    }

    const vnode = vDomContent[0]
    vnode.appContext = appContext
    vueRender(vnode, el)
  }

  function destroy() {
    if (currentEl) {
      vueRender(null, currentEl)
    }
  }

  return { render, destroy }
}
