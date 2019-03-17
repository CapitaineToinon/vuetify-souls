import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

Vue.config.productionTip = false

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify);

import router from './router';

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
