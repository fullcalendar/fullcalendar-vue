
# FullCalendar Vue 3 Component

The official [Vue 3](https://vuejs.org/) component for [FullCalendar](https://fullcalendar.io)

## Installation

Install the Vue 3 connector, the core package, and any plugins (like [daygrid](https://fullcalendar.io/docs/month-view)):

```sh
npm install @fullcalendar/vue3 @fullcalendar/core @fullcalendar/daygrid
```

## Usage

Render a `FullCalendar` component, passing-in an [options](https://fullcalendar.io/docs#toc) object:

```vue
<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: function() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: false,
        events: [
          { title: 'Meeting', start: new Date() }
        ]
      }
    }
  }
}
</script>

<template>
  <h1>Demo App</h1>
  <FullCalendar :options='calendarOptions' />
</template>
```

You can even pass in [named-slot](https://vuejs.org/guide/components/slots.html#named-slots) templates:

```vue
<template>
  <h1>Demo App</h1>
  <FullCalendar :options='calendarOptions'>
    <template v-slot:eventContent='arg'>
      <b>{{ arg.timeText }}</b>
      <i>{{ arg.event.title }}</i>
    </template>
  </FullCalendar>
</template>
```

# Links

- [Documentation](https://fullcalendar.io/docs/vue)
- [Example Project](https://github.com/fullcalendar/fullcalendar-example-projects/tree/master/vue3)
- [Contributor Guide](CONTRIBUTORS.md)
