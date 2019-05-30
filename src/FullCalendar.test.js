import { mount } from '@vue/test-utils'
import FullCalendar from './wrapper' // bad name, considering other "wrapper" in this file
import dayGridPlugin from '@fullcalendar/daygrid'

const DEFAULT_PROPS = {
  timeZone: 'UTC',
  plugins: [ dayGridPlugin ]
}


it('renders', function() {
  let wrapper = mount(FullCalendar, { propsData: DEFAULT_PROPS })
  expect(isSkeletonRendered(wrapper)).toBe(true)
})

it('unmounts and calls destroy', function() {
  let wrapper = mount(FullCalendar, { propsData: DEFAULT_PROPS })
  wrapper.destroy()
  expect(wrapper.emitted()._destroyed).toBeTruthy()
})

it('handles a single prop change', function() {
  let wrapper = mount(FullCalendar, { propsData: DEFAULT_PROPS })
  expect(isWeekendsRendered(wrapper)).toBe(true)
  wrapper.setProps({ weekends: false }) // good idea to test a falsy prop
  expect(isWeekendsRendered(wrapper)).toBe(false)
})

it('handles multiple prop changes, include event reset', function() {
  let eventRenderCnt = 0
  let viewSkeletonRenderCnt = 0

  let wrapper = mount(FullCalendar, { propsData: {
    ...DEFAULT_PROPS,
    events: buildEvents(1),
    eventRender() {
      eventRenderCnt++
    },
    viewSkeletonRender() {
      viewSkeletonRenderCnt++
    }
  }})

  expect(getRenderedEventCount(wrapper)).toBe(1)
  expect(isWeekendsRendered(wrapper)).toBe(true)
  expect(eventRenderCnt).toBe(1)
  expect(viewSkeletonRenderCnt).toBe(1)

  wrapper.setProps({
    dir: 'rtl',
    weekends: false,
    events: buildEvents(2)
  })

  expect(getRenderedEventCount(wrapper)).toBe(2)
  expect(isWeekendsRendered(wrapper)).toBe(false)
  expect(eventRenderCnt).toBe(3) // +2
  expect(viewSkeletonRenderCnt).toBe(2) // +1
})

it('emits an event', function() {
  let wrapper = mount(FullCalendar, { propsData: DEFAULT_PROPS })
  expect(wrapper.emitted()._eventsPositioned).toBeTruthy()
})

// DEPRECATED behavior
it('emits eventRender', function() {
  let wrapper = mount(FullCalendar, {
    propsData: {
      ...DEFAULT_PROPS,
      events: buildEvents(1)
    },
    listeners: {
      // eventRender() {} // should do a console.warn
    }
  })
  expect(wrapper.emitted().eventRender).toBeTruthy()
})

it('calls eventRender prop and can cancel rendering', function() {
  let eventRenderCalled = false

  let wrapper = mount(FullCalendar, {
    propsData: {
      ...DEFAULT_PROPS,
      events: buildEvents(1),
      eventRender() {
        eventRenderCalled = true
        return false
      }
    }
  })

  expect(eventRenderCalled).toBe(true)
  expect(getRenderedEventCount(wrapper)).toBe(0) // all were cancelled
})

it('should expose an API', function() {
  let wrapper = mount(FullCalendar, { propsData: DEFAULT_PROPS })
  let calendarApi = wrapper.vm.getApi()
  expect(calendarApi).toBeTruthy()

  let newDate = new Date(Date.UTC(2000, 0, 1))
  calendarApi.gotoDate(newDate)
  expect(calendarApi.getDate().valueOf()).toBe(newDate.valueOf())
})


// event reactivity

const WRAPPER_COMPONENT = {
  components: {
    FullCalendar
  },
  template: `
    <FullCalendar :plugins='calendarPlugins' :timeZone='calendarTimeZone' :events='calendarEvents' />
  `,
  data() {
    return {
      calendarPlugins: DEFAULT_PROPS.plugins,
      calendarTimeZone: DEFAULT_PROPS.timeZone,
      calendarEvents: buildEvents(1)
    }
  },
  methods: {
    addEvent() {
      this.calendarEvents.push(buildEvent(1))
    },
    updateTitle(title) {
      this.calendarEvents[0].title = title
    }
  }
}

it('reacts to event adding', function() {
  let wrapper = mount(WRAPPER_COMPONENT)
  expect(getRenderedEventCount(wrapper)).toBe(1)
  wrapper.vm.addEvent()
  expect(getRenderedEventCount(wrapper)).toBe(2)
})

it('reacts to event property changes', function() {
  let wrapper = mount(WRAPPER_COMPONENT)
  expect(getFirstEventTitle(wrapper)).toBe('event0')
  wrapper.vm.updateTitle('another title')
  expect(getFirstEventTitle(wrapper)).toBe('another title')
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
  return { title: 'event' + i, start: new Date() }
}


// DOM querying utils

function isSkeletonRendered(wrapper) {
  return wrapper.find('.fc').exists()
}

function isWeekendsRendered(wrapper) {
  return wrapper.find('.fc-sat').exists()
}

function getRenderedEventCount(wrapper) {
  return wrapper.findAll('.fc-event').length
}

function getFirstEventTitle(wrapper) {
  return wrapper.find('.fc-event .fc-title').text()
}
