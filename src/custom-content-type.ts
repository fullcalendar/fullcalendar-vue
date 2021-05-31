import { App, createApp, ComponentPublicInstance, VNode, Slot, h, AppContext } from 'vue'
import { createPlugin, PluginDef } from '@fullcalendar/core'

interface RootComponentData {
  content: VNode[]
}
type RootComponentInstance = ComponentPublicInstance<{}, {}, RootComponentData>

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
  let app: App
  let componentInstance: RootComponentInstance

  function render(el: HTMLElement, vDomContent: VNode[]) { // the handler
    if (currentEl !== el) {
      if (currentEl && app) { // if changing elements, recreate the vue
        app.unmount()
      }
      currentEl = el
    }

    if (!app) {
      app = initApp(vDomContent, appContext)

      // vue's mount method *replaces* the given element. create an artificial inner el
      let innerEl = document.createElement('span')
      el.appendChild(innerEl)

      componentInstance = app.mount(innerEl) as RootComponentInstance
    } else {
      componentInstance.content = vDomContent
    }
  }

  function destroy() {
    if (app) { // needed?
      app.unmount()
    }
  }

  return { render, destroy }
}

function initApp(initialContent: VNode[], appContext: AppContext): App {
  // TODO: do something with appContext
  return createApp({
    data() {
      return {
        content: initialContent,
      } as RootComponentData
    },
    render() {
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
