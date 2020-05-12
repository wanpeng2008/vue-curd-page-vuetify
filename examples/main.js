import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import PackageTest from '../packages/index'

Vue.config.productionTip = false
Vue.use(PackageTest)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')