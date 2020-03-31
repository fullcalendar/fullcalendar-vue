import Vue from 'vue'
import { mount } from '@vue/test-utils'
import FullCalendar from './install'
import dayGridPlugin from '@fullcalendar/daygrid'

/* NOTE:
had to hardcode @vue/test-utils at 1.0.0-beta.29 because later versions (1.0.0-beta.31 ?)
weren't rendering changes synchronously
*/

const DEFAULT_OPTIONS = {
  defaultDate: '2019-05-15',
  defaultView: 'dayGridMonth',
  timeZone: 'UTC',
  plugins: [ dayGridPlugin ]
}


it('renders', function() {
  let wrapper = mount(FullCalendar, { propsData: { options: DEFAULT_OPTIONS } })
  expect(isSkeletonRendered(wrapper)).toBe(true)
})

it('unmounts and calls destroy', function() {
  let unmounted = false
  let options = {
    ...DEFAULT_OPTIONS,
    viewWillUnmount() {
      unmounted = true
    }
  }

  let wrapper = mount(FullCalendar, { propsData: { options } })
  wrapper.destroy()
  expect(unmounted).toBeTruthy()
})

it('handles a single prop change', function() {
  let options = {
    ...DEFAULT_OPTIONS,
    weekends: true
  }

  let wrapper = mount(FullCalendar, { propsData: { options } })
  expect(isWeekendsRendered(wrapper)).toBe(true)

  // it's easy for the component to detect this change because the whole options object changes.
  // a more difficult scenario is when a component updates its own nested prop.
  // there's a test for that below (COMPONENT_FOR_OPTION_MANIP).
  wrapper.setProps({
    options: {
      ...options,
      weekends: false // good idea to test a falsy prop
    }
  })
  expect(isWeekendsRendered(wrapper)).toBe(false)
})

it('renders events with Date objects', function() { // necessary to test copy util
  let wrapper = mount(FullCalendar, {
    propsData: {
      options: {
        ...DEFAULT_OPTIONS,
        events: [
          { title: 'event', start: new Date(DEFAULT_OPTIONS.defaultDate) },
          { title: 'event', start: new Date(DEFAULT_OPTIONS.defaultDate) }
        ]
      }
    }
  })

  expect(getRenderedEventCount(wrapper)).toBe(2)
})

it('handles multiple prop changes, include event reset', function() {
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
    sync: false, // restore normal real-DOM batching
    propsData: { options }
  })

  expect(getRenderedEventCount(wrapper)).toBe(1)
  expect(isWeekendsRendered(wrapper)).toBe(true)
  expect(viewMountCnt).toBe(1)
  expect(eventRenderCnt).toBe(1)

  wrapper.setProps({
    options: {
      ...options,
      dir: 'rtl',
      weekends: false,
      events: buildEvents(2)
    }
  })

  viewMountCnt = 0
  eventRenderCnt = 0

  return Vue.nextTick().then(function() { // because of sync:false
    expect(getRenderedEventCount(wrapper)).toBe(2)
    expect(isWeekendsRendered(wrapper)).toBe(false)
    expect(viewMountCnt).toBe(0)
    expect(eventRenderCnt).toBe(2) // work on getttin gthis to 1
  })
})

it('should expose an API', function() {
  let wrapper = mount(FullCalendar, { propsData: { options: DEFAULT_OPTIONS } })
  let calendarApi = wrapper.vm.getApi()
  expect(calendarApi).toBeTruthy()

  let newDate = new Date(Date.UTC(2000, 0, 1))
  calendarApi.gotoDate(newDate)
  expect(calendarApi.getDate().valueOf()).toBe(newDate.valueOf())
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

it('should expose an API in $refs', function() {
  let wrapper = mount(COMPONENT_FOR_API)
  let newDate = new Date(Date.UTC(2000, 0, 1))

  wrapper.vm.gotoDate(newDate)
  expect(wrapper.vm.getDate().valueOf()).toBe(newDate.valueOf())
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
        header: buildToolbar(),
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

it('handles an object change when prop is reassigned', function() {
  let wrapper = mount(COMPONENT_FOR_OPTION_MANIP)
  expect(isWeekendsRendered(wrapper)).toBe(true)

  wrapper.vm.disableWeekends()
  expect(isWeekendsRendered(wrapper)).toBe(false)
})

it('avoids rerendering unchanged toolbar/events', function() {
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

  expect(viewMountCnt).toBe(1)
  expect(eventRenderCnt).toBe(1)

  viewMountCnt = 0
  eventRenderCnt = 0

  wrapper.vm.changeSomething()
  expect(viewMountCnt).toBe(0)
  expect(eventRenderCnt).toBe(0)
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

it('reacts to event adding', function() {
  let wrapper = mount(COMPONENT_FOR_EVENT_MANIP)
  expect(getRenderedEventCount(wrapper)).toBe(1)
  wrapper.vm.addEvent()
  expect(getRenderedEventCount(wrapper)).toBe(2)
})

it('reacts to event property changes', function() {
  let wrapper = mount(COMPONENT_FOR_EVENT_MANIP)
  expect(getFirstEventTitle(wrapper)).toBe('event0')
  wrapper.vm.updateTitle('another title')
  expect(getFirstEventTitle(wrapper)).toBe('another title')
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
      setTimeout(function() {
        successCallback(buildEvents(2))
      }, 0)
    }
  }
}

it('can receive an async event function', function(done) {
  let wrapper = mount(EVENT_FUNC_COMPONENT)
  setTimeout(function() {
    expect(getRenderedEventCount(wrapper)).toBe(2)
    done()
  }, 100)
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

it('reacts to computed events prop', function() {
  let wrapper = mount(EVENT_COMP_PROP_COMPONENT)
  expect(getRenderedEventCount(wrapper)).toBe(0)
  wrapper.vm.markNotFirst()
  expect(getRenderedEventCount(wrapper)).toBe(2)
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
  return { title: 'event' + i, start: DEFAULT_OPTIONS.defaultDate }
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

function getRenderedEventCount(wrapper) {
  return wrapper.findAll('.fc-event').length
}

function getFirstEventTitle(wrapper) {
  return wrapper.find('.fc-event-title').text()
}
