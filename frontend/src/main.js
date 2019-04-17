import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";

Vue.config.productionTip = false;
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "flag-icon-css/css/flag-icon.min.css";

import theme from "./theme";
Vue.use(Vuetify, { theme });

import filters from "./api/filters";
Object.keys(filters).map(key => {
  Vue.filter(key, filters[key]);
});

import router from "./router";
import store from "./store";
import { mapActions, mapGetters } from "vuex";

import VuetifyToast from 'vuetify-toast-snackbar'
Vue.use(VuetifyToast, {
  x: 'right', 
  y: 'bottom', 
  color: 'info', 
  icon: 'info',
  timeout: 0, 
  dismissable: true, 
  autoHeight: false, 
  multiLine: false, 
  vertical: false, 
  shorts: {
    custom: {
      color: 'purple'
    }
  },
  property: '$toast' 
})

import axios from "axios";

new Vue({
  render: h => h(App),
  store,
  router,
  computed: mapGetters({
    games: "speedruncom/games"
  }),
  methods: mapActions({
    getGames: "speedruncom/getGames"
  }),
  created() {

    /**
     * Success and error events from the API
     */
    axios.interceptors.response.use(
      response => response,
      (error) => {
        this.$toast.error('Something went wrong');
        console.error(error);
        return Promise.reject();
      }
    )

    this.getGames().then(() => {
      /* eslint-disable */
      if (process.env.NODE_ENV !== "production") {
        console.log("Games properly loaded from main.js", this.games);
        console.log(process.env.NODE_ENV);
      }
      /* eslint-disable */
    });
  }
}).$mount("#app");
