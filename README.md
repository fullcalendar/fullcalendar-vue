
# FullCalendar Vue 2 Component

The official [Vue 2](https://v2.vuejs.org/) component for [FullCalendar](https://fullcalendar.io)

> For [Vue 3](https://vuejs.org/), use the [@fullcalendar/vue3](https://github.com/fullcalendar/fullcalendar-vue) package

## Installation

Install the Vue 2 connector, the core package, and any plugins (like [daygrid](https://fullcalendar.io/docs/month-view)):

```sh
npm install @fullcalendar/vue @fullcalendar/core @fullcalendar/daygrid
```

## Usage

Render a `FullCalendar` component, passing-in an [options](https://fullcalendar.io/docs#toc) object:

```vue
<script>
import FullCalendar from '@fullcalendar/vue'
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
  <div>
    <h1>Demo App</h1>
    <FullCalendar :options='calendarOptions' />
  </div>
</template>
```

You can even pass in [named-slot](https://v2.vuejs.org/v2/guide/components-slots.html#Named-Slots) templates:

```vue
<template>
  <div>
    <h1>Demo App</h1>
    <FullCalendar :options='calendarOptions'>
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>
```

# Links

- [Documentation](https://fullcalendar.io/docs/vue)
- [Example Project](https://github.com/fullcalendar/fullcalendar-example-projects/tree/master/vue2)
- [Contributor Guide](CONTRIBUTORS.md)
