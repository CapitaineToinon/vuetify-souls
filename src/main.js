// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import store from './store';

/**
 * TODO ? -> https://github.com/vuejs/vuex-router-sync
 */

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

/**
 * Stuff
 */
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {
        App,
    },
    template: '<App/>',
});
