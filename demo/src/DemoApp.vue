<template>
  <div class='demo-app'>
    <div class='demo-app-top'>
      <button @click="toggleWeekends">dynamically toggle weekends</button>
      <button @click="gotoPast">go to a date in the past</button>
      (also, click a date/time to add an event)
    </div>
    <FullCalendar
      class='demo-app-calendar'
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :events="calendarEvents"
      @dateClick="handleDateClick"
      />
  </div>
</template>

<script>
import FullCalendar from '../../src/wrapper'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: function() {
    return {
      calendarPlugins: [ // plugins must be defined in the JS
        dayGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: [ // initial event data
        { title: 'Event Now', start: new Date() }
      ]
    }
  },
  methods: {
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends // update a property
    },
    gotoPast() {
      let calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    },
    handleDateClick(arg) {
      if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
        this.calendarEvents.push({ // add new event data
          title: 'New Event',
          date: arg.date,
          allDay: arg.allDay
        })
      }
    }
  }
}

</script>

<style>

/* you must include each plugins' css */
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-top {
  margin: 0 0 3em;
}

.demo-app-calendar {
  margin: 0 auto;
  max-width: 900px;
}

</style>
