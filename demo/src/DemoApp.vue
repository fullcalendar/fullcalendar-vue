<template>
  <div id="app">
    <button @click="toggleAllDaySlot">toggle allDaySlot</button>
    <button @click="toggleCalendar">toggle calendar</button>
    <FullCalendar
      id="myfullcalendar"
      class="mycoolclass"
      v-if="isShowingCalendar"
      :plugins="calendarPlugins"
      :header="{ left: 'prev,next today', right: 'title' }"
      defaultView="timeGridWeek"
      :allDaySlot="calendarAllDaySlot"
      :weekends="calendarWeekends"
      @dateClick="handleDateClick"
      timeZone="UTC"
      />
  </div>
</template>

<script>
import FullCalendar from '../../src/main'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'app',

  data: function() {
    return {
      isShowingCalendar: true,
      calendarPlugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin ],
      calendarAllDaySlot: true,
      calendarWeekends: true
    }
  },

  components: {
    FullCalendar
  },

  methods: {

    toggleCalendar() {
      this.isShowingCalendar = !this.isShowingCalendar
    },

    toggleAllDaySlot() {
      this.calendarWeekends = !this.calendarWeekends
      this.calendarAllDaySlot = !this.calendarAllDaySlot
    },

    handleDateClick(arg) {
      console.log('dateClick', arg.dateStr)
    }

  }
}

</script>

<style>
@import '@fullcalendar/core/main.css';
@import '@fullcalendar/daygrid/main.css';
@import '@fullcalendar/timegrid/main.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
