import { mount } from '@vue/test-utils'
import FullCalendar from '../dist/main.esm'
import dayGridPlugin from '@fullcalendar/daygrid'

describe('something', function() {
  it('should work', function() {
    let wrapper = mount(FullCalendar, {
      propsData: {
        plugins: [ dayGridPlugin ]
      }
    })
    let vm = wrapper.vm
    // console.log(vm)
    expect(vm).toBeTruthy()
  })
})
