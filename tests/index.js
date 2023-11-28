import { nextTick, defineAsyncComponent, h } from 'vue'
import { createI18n } from 'vue-i18n'
import { mount as _mount } from '@vue/test-utils'
import FullCalendar from '../dist/index.js'
import dayGridPlugin from '@fullcalendar/daygrid'

const INITIAL_DATE = '2019-05-15'

const DEFAULT_OPTIONS = {
  initialDate: INITIAL_DATE,
  initialView: 'dayGridMonth',
  timeZone: 'UTC',
  plugins: [ dayGridPlugin ]
}

let currentWrapper
let currentContainerEl

function mount(component, options = {}) {
  if (options.attachTo === undefined) {
    currentContainerEl = document.body.appendChild(document.createElement('div'))
    options = {
      ...options,
      attachTo: currentContainerEl
    }
  }

  currentWrapper = _mount(component, options)
  return currentWrapper
}

afterEach(function() {
  if (currentWrapper) {
    currentWrapper.unmount()
    currentWrapper = null
  }
  if (currentContainerEl) {
    currentContainerEl.remove()
    currentContainerEl = null
  }
})


it('renders', async () => {
  let wrapper = mount(FullCalendar, { propsData: { options: DEFAULT_OPTIONS } })
  expect(isSkeletonRendered(wrapper)).toEqual(true)
})

it('unmounts and calls destroy', async () => {
  let unmounted = false
  let options = {
    ...DEFAULT_OPTIONS,
    viewWillUnmount() {
      unmounted = true
    }
  }

  let wrapper = mount(FullCalendar, { propsData: { options } })
  wrapper.unmount()
  expect(unmounted).toBeTruthy()
})

it('handles a single prop change', async () => {
  let options = {
    ...DEFAULT_OPTIONS,
    weekends: true
  }
  let wrapper = mount(FullCalendar, {
    propsData: { options }
  })
  expect(isWeekendsRendered(wrapper)).toEqual(true)

  // it's easy for the component to detect this change because the whole options object changes.
  // a more difficult scenario is when a component updates its own nested prop.
  // there's a test for that below (COMPONENT_FOR_OPTION_MANIP).
  wrapper.setProps({
    options: {
      ...options,
      weekends: false // good idea to test a falsy prop
    }
  })
  await nextTick()
  expect(isWeekendsRendered(wrapper)).toEqual(false)
})

it('renders events with Date objects', async () => { // necessary to test copy util
  let wrapper = mount(FullCalendar, {
    propsData: {
      options: {
        ...DEFAULT_OPTIONS,
        events: [
          { title: 'event', start: new Date(INITIAL_DATE) },
          { title: 'event', start: new Date(INITIAL_DATE) }
        ]
      }
    }
  })

  expect(getRenderedEventCount(wrapper)).toEqual(2)
})

it('handles multiple prop changes, include event reset', async () => {
  let viewMountCnt = 0
  let eventRenderCnt = 0
  let options = {
    ...DEFAULT_OPTIONS,
    events: buildEvents(1),
    viewDidMount() {
      viewMountCnt++
    },
    eventContent() {
      eventRenderCnt++
    }
  }

  let wrapper = mount(FullCalendar, {
    propsData: { options }
  })

  expect(getRenderedEventCount(wrapper)).toEqual(1)
  expect(isWeekendsRendered(wrapper)).toEqual(true)
  expect(viewMountCnt).toEqual(1)
  expect(eventRenderCnt).toEqual(1)

  viewMountCnt = 0
  eventRenderCnt = 0

  wrapper.setProps({
    options: {
      ...options,
      direction: 'rtl',
      weekends: false,
      events: buildEvents(2)
    }
  })

  await nextTick()
  expect(getRenderedEventCount(wrapper)).toEqual(2)
  expect(isWeekendsRendered(wrapper)).toEqual(false)
  expect(viewMountCnt).toEqual(0)
  expect(eventRenderCnt).toEqual(2) // TODO: get this down to 1 (only 1 new event rendered)
})

it('should expose an API', async () => {
  let wrapper = mount(FullCalendar, { propsData: { options: DEFAULT_OPTIONS } })
  let calendarApi = wrapper.vm.getApi()
  expect(calendarApi).toBeTruthy()

  let newDate = new Date(Date.UTC(2000, 0, 1))
  calendarApi.gotoDate(newDate)
  expect(calendarApi.getDate().valueOf()).toEqual(newDate.valueOf())
})


const COMPONENT_FOR_API = {
  components: {
    FullCalendar
  },
  template: `
    <div>
      <FullCalendar :options='calendarOptions' ref='fullCalendar' />
    </div>
  `,
  data() {
    return {
      calendarOptions: DEFAULT_OPTIONS
    }
  },
  methods: {
    gotoDate(newDate) {
      let calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.gotoDate(newDate)
    },
    getDate() {
      let calendarApi = this.$refs.fullCalendar.getApi()
      return calendarApi.getDate()
    }
  }
}

it('should expose an API in $refs', async () => {
  let wrapper = mount(COMPONENT_FOR_API)
  let newDate = new Date(Date.UTC(2000, 0, 1))

  wrapper.vm.gotoDate(newDate)
  expect(wrapper.vm.getDate().valueOf()).toEqual(newDate.valueOf())
})


it('should handle multiple refs $refs', async () => {
  let wrapper = mount({
    components: {
      FullCalendar
    },
    template: `
      <div>
        <FullCalendar :options='calendarOptions0' ref='fullCalendar0' />
        <FullCalendar :options='calendarOptions1' ref='fullCalendar1' />
        <FullCalendar :options='calendarOptions2' ref='fullCalendar2' />
      </div>
    `,
    data() {
      return {
        calendarOptions0: DEFAULT_OPTIONS,
        calendarOptions1: DEFAULT_OPTIONS,
        calendarOptions2: DEFAULT_OPTIONS,
      }
    },
    methods: {
      check() {
        let ref0 = this.$refs.fullCalendar0.getApi()
        let ref1 = this.$refs.fullCalendar1.getApi()
        let ref2 = this.$refs.fullCalendar2.getApi()
        expect(ref0).not.toEqual(ref1)
        expect(ref1).not.toEqual(ref2)
        expect(ref2).not.toEqual(ref0)
      }
    }
  })
  wrapper.vm.check()
})


// toolbar/event non-reactivity

const COMPONENT_FOR_OPTION_MANIP = {
  props: [ 'calendarViewDidMount', 'calendarEventContent' ],
  components: {
    FullCalendar
  },
  template: `
    <div>
      <div>calendarHeight: {{ calendarOptions.height }}</div>
      <FullCalendar :options='calendarOptions' />
    </div>
  `,
  data() {
    return {
      something: 0,
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        viewDidMount: this.calendarViewDidMount, // pass the prop
        eventContent: this.calendarEventContent, // pass the prop
        headerToolbar: buildToolbar(),
        events: buildEvents(1),
        weekends: true // needs to be initially present if we plan on changing it (a Vue concept)
      }
    }
  },
  methods: {
    changeSomething() {
      this.something++
    },
    disableWeekends() {
      this.calendarOptions.weekends = false
    }
  }
}

it('handles an object change when prop is reassigned', async () => {
  let wrapper = mount(COMPONENT_FOR_OPTION_MANIP)
  expect(isWeekendsRendered(wrapper)).toEqual(true)

  wrapper.vm.disableWeekends()
  await nextTick()
  expect(isWeekendsRendered(wrapper)).toEqual(false)
})

it('avoids rerendering unchanged toolbar/events', async () => {
  let viewMountCnt = 0
  let eventRenderCnt = 0

  let wrapper = mount(COMPONENT_FOR_OPTION_MANIP, {
    propsData: {
      calendarViewDidMount() {
        viewMountCnt++
      },
      calendarEventContent() {
        eventRenderCnt++
      }
    }
  })

  expect(viewMountCnt).toEqual(1)
  expect(eventRenderCnt).toEqual(1)

  viewMountCnt = 0
  eventRenderCnt = 0

  wrapper.vm.changeSomething()
  expect(viewMountCnt).toEqual(0)
  expect(eventRenderCnt).toEqual(0)
})


// event reactivity

const COMPONENT_FOR_EVENT_MANIP = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions' />
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1)
      }
    }
  },
  methods: {
    addEvent() {
      this.calendarOptions.events.push(buildEvent(1))
    },
    updateTitle(title) {
      this.calendarOptions.events[0].title = title
    }
  }
}

it('reacts to event adding', async () => {
  let wrapper = mount(COMPONENT_FOR_EVENT_MANIP)
  expect(getRenderedEventCount(wrapper)).toEqual(1)

  wrapper.vm.addEvent()
  await nextTick()
  expect(getRenderedEventCount(wrapper)).toEqual(2)
})

it('reacts to event property changes', async () => {
  let wrapper = mount(COMPONENT_FOR_EVENT_MANIP)
  expect(getFirstEventTitle(wrapper)).toEqual('event0')
  wrapper.vm.updateTitle('another title')

  await nextTick()
  expect(getFirstEventTitle(wrapper)).toEqual('another title')
})


// event reactivity with fetch function

const EVENT_FUNC_COMPONENT = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions' />
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: this.fetchEvents
      }
    }
  },
  methods: {
    fetchEvents(fetchInfo, successCallback) {
      setTimeout(() => {
        successCallback(buildEvents(2))
      }, 0)
    }
  }
}

it('can receive an async event function', function(done) {
  let wrapper = mount(EVENT_FUNC_COMPONENT)
  setTimeout(() => {
    expect(getRenderedEventCount(wrapper)).toEqual(2)
    done()
  }, 100) // more than event function's setTimeout
})


// event reactivity with computed prop

const EVENT_COMP_PROP_COMPONENT = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions' />
  `,
  data() {
    return {
      first: true
    }
  },
  computed: {
    calendarOptions() {
      return {
        ...DEFAULT_OPTIONS,
        events: this.first ? [] : buildEvents(2)
      }
    }
  },
  methods: {
    markNotFirst() {
      this.first = false
    }
  }
}

it('reacts to computed events prop', async () => {
  let wrapper = mount(EVENT_COMP_PROP_COMPONENT)
  expect(getRenderedEventCount(wrapper)).toEqual(0)

  wrapper.vm.markNotFirst()
  await nextTick()
  expect(getRenderedEventCount(wrapper)).toEqual(2)
})


// component with vue slots

const COMPONENT_WITH_SLOTS = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1)
      }
    }
  },
  methods: {
    resetEvents() {
      this.calendarOptions.events = buildEvents(1)
    }
  }
}

it('renders and rerenders a custom slot', async () => {
  let wrapper = mount(COMPONENT_WITH_SLOTS)
  await nextTick()

  let eventEl = getRenderedEventEls(wrapper)[0]
  expect(eventEl.findAll('i').length).toEqual(1)

  wrapper.vm.resetEvents()
  await nextTick()
  eventEl = getRenderedEventEls(wrapper)[0]
  expect(eventEl.findAll('i').length).toEqual(1)
})

it('calls nested vue lifecycle methods when in custom content', async () => {
  let mountedCalled = false
  let beforeUnmountCalled = false
  let unmountedCalled = false
  let wrapper = mount({
    components: {
      FullCalendar,
      EventContent: {
        props: {
          event: { type: Object, required: true }
        },
        template: `
          <div>{{ event.title }}</div>
        `,
        mounted() {
          mountedCalled = true
        },
        beforeUnmount() {
          beforeUnmountCalled = true
        },
        unmounted() {
          unmountedCalled = true
        },
      }
    },
    template: `
      <FullCalendar :options='calendarOptions'>
        <template v-slot:eventContent="arg">
          <EventContent :event="arg.event" />
        </template>
      </FullCalendar>
    `,
    data() {
      return {
        calendarOptions: {
          ...DEFAULT_OPTIONS,
          events: buildEvents(1)
        }
      }
    }
  })
  await nextTick()
  expect(mountedCalled).toEqual(true)

  wrapper.unmount()
  await nextTick()
  expect(beforeUnmountCalled).toEqual(true)
  expect(unmountedCalled).toEqual(true)
})

// component with eventContent (two multi-day event)

const COMPONENT_WITH_SLOTS_MULTIDAY_EVENTS = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: [
          { title: 'all-day 1', start: INITIAL_DATE, end: '2019-05-18' }, // 3 day
          { title: 'all-day 2', start: INITIAL_DATE, end: '2019-05-17' }, // 2 day
        ]
      }
    }
  }
}

it('renders two multi-day events positioned correctly', async () => {
  let wrapper = mount(COMPONENT_WITH_SLOTS_MULTIDAY_EVENTS)
  await nextTick()

  let eventEls = getRenderedEventEls(wrapper).map((wrapper) => wrapper.element)
  expect(eventEls.length).toBe(2)
  expect(anyElsIntersect(eventEls)).toBe(false)
})

// component with eventContent (multi-day & timed)

const COMPONENT_WITH_SLOTS_MULTIDAY_AND_TIMED = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: [
          { title: 'all-day 1', start: INITIAL_DATE, end: '2019-05-18' }, // 3 day
          { title: 'all-day 2', start: INITIAL_DATE + 'T12:00:00' },
        ]
      }
    }
  }
}

it('renders a multi-day and timed event positioned correctly', async () => {
  let wrapper = mount(COMPONENT_WITH_SLOTS_MULTIDAY_AND_TIMED)
  await nextTick()

  let eventEls = getRenderedEventEls(wrapper).map((wrapper) => wrapper.element)
  expect(eventEls.length).toBe(2)
  expect(anyElsIntersect(eventEls)).toBe(false)
})

// component with vue slots AND custom render func

const COMPONENT_WITH_SLOTS2 = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1),
        eventContent: (eventArg) => {
          return h('i', {}, eventArg.event.title)
        }
      }
    }
  }
}

it('render function can return jsx', async () => {
  let wrapper = mount(COMPONENT_WITH_SLOTS2)
  await nextTick()

  let eventEl = getRenderedEventEls(wrapper)[0]
  expect(eventEl.findAll('i').length).toEqual(1)
})

// component with vue slots AND custom render func that returns vanilla-js-style objects

const COMPONENT_WITH_SLOTS3 = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :options='calendarOptions'></FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1),
        eventContent: (eventArg) => {
          return { html: `<i>${eventArg.event.title}</i>` }
        }
      }
    }
  }
}

it('render function can returns vanilla-js-style objects', async () => {
  let wrapper = mount(COMPONENT_WITH_SLOTS3)
  await nextTick()

  let eventEl = getRenderedEventEls(wrapper)[0]
  expect(eventEl.findAll('i').length).toEqual(1)
})

// event rendering and did-mount hooks

;['auto', 'background'].forEach((eventDisplay) => {
  it(`during ${eventDisplay} custom event rendering, receives el`, async () => {
    let eventDidMountCalled = false

    mount({
      components: {
        FullCalendar
      },
      template: `
        <FullCalendar :options='calendarOptions'>
          <template #eventContent='arg'>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      `,
      data() {
        return {
          calendarOptions: {
            ...DEFAULT_OPTIONS,
            events: [
              {
                title: 'Event 1',
                start: INITIAL_DATE,
                display: eventDisplay,
              },
            ],
            eventDidMount: (eventInfo) => {
              expect(eventInfo.el).toBeTruthy()
              eventDidMountCalled = true
            }
          }
        }
      }
    })

    await nextTick()
    expect(eventDidMountCalled).toBe(true)
  })
})

//

const OTHER_COMPONENT = {
  template: '<i>other component</i>'
}

const COMPONENT_USING_ROOT_OPTIONS_IN_SLOT = {
  components: {
    FullCalendar,
    OtherComponent: OTHER_COMPONENT
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <OtherComponent />
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1)
      }
    }
  },
}

it('can use component defined in higher contexts', async () => {
  let wrapper = mount(COMPONENT_USING_ROOT_OPTIONS_IN_SLOT)
  let eventEl = getRenderedEventEls(wrapper)[0]

  await nextTick()
  expect(eventEl.findAll('i').length).toEqual(1)
})


it('allows plugin access for slots', async () => {
  let helloJp = 'こんにちは、世界'
  let i18n = createI18n({
    locale: 'ja',
    messages: {
      ja: {
        message: {
          hello: helloJp
        }
      }
    }
  })
  let Component = {
    components: {
      FullCalendar,
    },
    template: `
      <FullCalendar :options='calendarOptions'>
        <template v-slot:eventContent="arg">
          <b>{{ $t("message.hello") }}</b>
        </template>
      </FullCalendar>
    `,
    data() {
      return {
        calendarOptions: {
          ...DEFAULT_OPTIONS,
          events: buildEvents(1)
        }
      }
    },
  }
  let wrapper = mount(Component, {
    global: {
      plugins: [i18n]
    }
  })

  await nextTick()
  let eventEl = getRenderedEventEls(wrapper)[0]
  expect(eventEl.text()).toEqual(helloJp)
})


// dynamic events

const DynamicEvent = defineAsyncComponent(() => import('./DynamicEvent.vue'))

const COMPONENT_WITH_DYNAMIC_SLOTS = {
  components: {
    FullCalendar,
    DynamicEvent
  },
  template: `
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent="arg">
        <DynamicEvent :event="arg.event" />
      </template>
    </FullCalendar>
  `,
  data() {
    return {
      calendarOptions: {
        ...DEFAULT_OPTIONS,
        events: buildEvents(1)
      }
    }
  }
}

// https://github.com/fullcalendar/fullcalendar-vue/issues/122
it('renders dynamically imported event', (done) => {
  let wrapper = mount(COMPONENT_WITH_DYNAMIC_SLOTS)
  let eventEl = getRenderedEventEls(wrapper).at(0)

  setTimeout(() => {
    expect(eventEl.findAll('.dynamic-event').length).toEqual(1)
    done()
  }, 100)
})


// slots data binding

it('slot rendering reacts to bound parent state', async () => {
  let wrapper = mount({
    components: {
      FullCalendar,
    },
    template: `
      <FullCalendar :options='calendarOptions'>
        <template v-slot:eventContent="arg">
          <b v-if="isBold">Event:</b>
          <i v-else>Event:</i>
          {{ arg.event.title }}
        </template>
      </FullCalendar>
    `,
    data() {
      return {
        isBold: false,
        calendarOptions: {
          ...DEFAULT_OPTIONS,
          events: buildEvents(1)
        }
      }
    },
    methods: {
      turnBold() {
        this.isBold = true
      }
    }
  })
  let eventEl = getRenderedEventEls(wrapper).at(0)

  await nextTick()
  expect(eventEl.findAll('b').length).toEqual(0)
  expect(eventEl.findAll('i').length).toEqual(1)
  wrapper.vm.turnBold()

  await nextTick()
  expect(eventEl.findAll('b').length).toEqual(1)
  expect(eventEl.findAll('i').length).toEqual(0)
})


// FullCalendar options utils

function buildEvents(length) {
  let events = []

  for (let i = 0; i < length; i++) {
    events.push(buildEvent(i))
  }

  return events
}

function buildEvent(i) {
  return { title: 'event' + i, start: INITIAL_DATE }
}

function buildToolbar() {
  return {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  }
}


// DOM querying utils

function isSkeletonRendered(wrapper) {
  return wrapper.find('.fc').exists()
}

function isWeekendsRendered(wrapper) {
  return wrapper.find('.fc-day-sat').exists()
}

function getRenderedEventEls(wrapper) {
  return wrapper.findAll('.fc-event')
}

function getRenderedEventCount(wrapper) {
  return getRenderedEventEls(wrapper).length
}

function getFirstEventTitle(wrapper) {
  return wrapper.find('.fc-event-title').text()
}


// DOM geometry utils

function anyElsIntersect(els) {
  let rects = els.map((el) => el.getBoundingClientRect())

  for (let i = 0; i < rects.length; i += 1) {
    for (let j = i + 1; j < rects.length; j += 1) {
      if (rectsIntersect(rects[i], rects[j])) {
        return [els[i], els[j]]
      }
    }
  }

  return false
}

function rectsIntersect(rect0, rect1) {
  return rect0.left < rect1.right && rect0.right > rect1.left && rect0.top < rect1.bottom && rect0.bottom > rect1.top
}
