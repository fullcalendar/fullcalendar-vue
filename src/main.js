// Import vue component
import FullCalendarComponent from './FullCalendar'

let installed = false

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (!installed) {
    installed = true;
    Vue.component('FullCalendar', FullCalendarComponent)
  }
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}
if (GlobalVue) {
	GlobalVue.use({
    install
  })
}

// To allow use as module (npm/webpack/etc.) export component
export default FullCalendarComponent
