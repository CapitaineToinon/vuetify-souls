import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";

import Loader from "@/components/Loader";
Vue.component("loader", Loader);

import VueBreadcrumbs from 'vuejs2-breadcrumbs'
import options from '@/api/breadcrumbs.js'
Vue.use(VueBreadcrumbs, options);

Vue.config.productionTip = false;

import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "flag-icon-css/css/flag-icon.min.css";
import theme from "./theme";
Vue.use(Vuetify, { theme });

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube);

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
    games: "speedruncom/games",
    streams: "twitch/streams",
  }),
  methods: mapActions({
    updateGames: "speedruncom/updateGames",
    initUpdateLoop: "twitch/initUpdateLoop",
  }),
  created() {
    /**
     * Success and error events from the API
     */
    axios.interceptors.response.use(
      response => response,
      (error) => {
        this.$toast.error(error.message);
        console.error(error);
      }
    )

    this.updateGames();
  },

  mounted() {
    this.initUpdateLoop();
  }
}).$mount("#app");
