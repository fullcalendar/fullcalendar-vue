import { PropType, defineComponent, h, Fragment, Teleport, VNode } from 'vue'
import { Calendar, CalendarOptions } from '@fullcalendar/core'
import { CustomRenderingStore, CustomRendering } from '@fullcalendar/core/internal'
import { OPTION_IS_COMPLEX } from './options.js'

const FullCalendar = defineComponent({
  props: {
    options: Object as PropType<CalendarOptions>
  },

  data() {
    return {
      renderId: 0,
      customRenderingMap: new Map<string, CustomRendering<any>>()
    }
  },

  methods: {
    getApi(): Calendar {
      return getSecret(this).calendar
    },

    buildOptions(suppliedOptions: CalendarOptions | undefined): CalendarOptions {
      return {
        ...suppliedOptions,
        customRenderingMetaMap: kebabToCamelKeys(this.$slots),
        handleCustomRendering: getSecret(this).handleCustomRendering,
      }
    },
  },

  render() {
    const customRenderingNodes: VNode[] = []

    for (const customRendering of this.customRenderingMap.values()) {
      customRenderingNodes.push(
        h(CustomRenderingComponent, {
          key: customRendering.id,
          customRendering,
        })
      )
    }

    return h('div', {
      // when renderId is changed, Vue will trigger a real-DOM async rerender, calling beforeUpdate/updated
      attrs: { 'data-fc-render-id': this.renderId }
    }, h(Fragment, customRenderingNodes)) // for containing CustomRendering keys
  },

  mounted() {
    const customRenderingStore = new CustomRenderingStore<any>()
    getSecret(this).handleCustomRendering = customRenderingStore.handle.bind(customRenderingStore)

    const calendarOptions = this.buildOptions(this.options)
    const calendar = new Calendar(this.$el as HTMLElement, calendarOptions)
    getSecret(this).calendar = calendar

    calendar.render()
    customRenderingStore.subscribe((customRenderingMap) => {
      this.customRenderingMap = customRenderingMap // likely same reference, so won't rerender
      this.renderId++ // force rerender
      getSecret(this).needCustomRenderingResize = true
    })
  },

  beforeUpdate() {
    this.getApi().resumeRendering() // the watcher handlers paused it
  },

  updated() {
    if (getSecret(this).needCustomRenderingResize) {
      getSecret(this).needCustomRenderingResize = false
      this.getApi().updateSize()
    }
  },

  beforeUnmount() {
    this.getApi().destroy()
  },

  watch: buildWatchers()
})

export default FullCalendar

// Custom Rendering
// -------------------------------------------------------------------------------------------------

const CustomRenderingComponent = defineComponent({
  props: {
    customRendering: Object as PropType<CustomRendering<any>>
  },

  render() {
    const customRendering = this.customRendering!
    const innerContent = typeof customRendering.generatorMeta === 'function' ?
      customRendering.generatorMeta(customRendering.renderProps) : // vue-normalized slot function
      customRendering.generatorMeta // probably a vue JSX node returned from content-inject func

    return h(Teleport, { to: customRendering.containerEl }, innerContent)
  }
})

// Internals
// -------------------------------------------------------------------------------------------------

type FullCalendarInstance = InstanceType<typeof FullCalendar>

interface FullCalendarSecret {
  calendar: Calendar
  handleCustomRendering: (customRendering: CustomRendering<any>) => void
  needCustomRenderingResize?: boolean
}

// storing internal state:
// https://github.com/vuejs/vue/issues/1988#issuecomment-163013818
function getSecret(inst: FullCalendarInstance): FullCalendarSecret {
  return inst as any as FullCalendarSecret
}

function buildWatchers() {

  let watchers: { [member: string]: any } = {

    // watches changes of ALL options and their nested objects,
    // but this is only a means to be notified of top-level non-complex options changes.
    options: {
      deep: true,
      handler(this: FullCalendarInstance, options: CalendarOptions) {
        let calendar = this.getApi()
        calendar.pauseRendering()

        let calendarOptions = this.buildOptions(options)
        calendar.resetOptions(calendarOptions)

        this.renderId++ // will queue a rerender
      }
    }
  }

  for (let complexOptionName in OPTION_IS_COMPLEX) {

    // handlers called when nested objects change
    watchers[`options.${complexOptionName}`] = {
      deep: true,
      handler(this: FullCalendarInstance, val: any) {

        // unfortunately the handler is called with undefined if new props were set, but the complex one wasn't ever set
        if (val !== undefined) {

          let calendar = this.getApi()
          calendar.pauseRendering()
          calendar.resetOptions({
            [complexOptionName]: val
          }, [complexOptionName])

          this.renderId++ // will queue a rerender
        }
      }
    }
  }

  return watchers
}

// General Utils
// -------------------------------------------------------------------------------------------------

function kebabToCamelKeys<V>(map: { [key: string]: V }): { [key: string]: V } {
  const newMap: { [key: string]: V } = {}

  for (const key in map) {
    newMap[kebabToCamel(key)] = map[key]
  }

  return newMap
}

function kebabToCamel(s: string): string {
  return s
    .split('-')
    .map((word, index) => index ? capitalize(word) : word)
    .join('')
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
