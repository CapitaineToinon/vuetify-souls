/**
 * jQuery
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


/**
 * semantic-ui
 */
import 'semantic-ui/dist/semantic.min.css'

window.$ = window.jQuery = require('jquery')

import SuiVue from 'semantic-ui-vue';
Vue.use(SuiVue)

// require('semantic-ui/dist/semantic.min')

/**
 * Filters
 */
import moment from 'moment'

Vue.filter('formatTime', function (value) {
    if (value) {
        var ms = value.toString().split('.').length > 1;
        if (value !== 0) {
            var moment_t = moment.duration(value, 'seconds');
            var format = '';
            if (moment_t.hours() > 0) {
                if (ms) {
                    format = "H:mm:ss.SSS";
                } else {
                    format = "H:mm:ss";
                }
            } else {
                if (ms) {
                    format = "mm:ss.SSS";
                } else {
                    format = "mm:ss";
                }
            }

            return moment.utc(value * 1000).format(format);
        } else {
            return '';
        }
    }
})

/**
 * Stuff
 */
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
})
