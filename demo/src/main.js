import Vue from 'vue'
import DemoApp from './DemoApp.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(DemoApp)
}).$mount('#demo-app-placeholder')
