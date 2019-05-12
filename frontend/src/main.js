import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import axios from "axios";

Vue.config.productionTip = false;

import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "flag-icon-css/css/flag-icon.min.css";
import theme from "./theme";
Vue.use(Vuetify, { theme });

import VueYoutube from 'vue-youtube'
import Loader from "@/components/Loader";
import VueBreadcrumbs from 'vuejs2-breadcrumbs';
import options from '@/api/breadcrumbs.js';

Vue.use(VueYoutube);
Vue.component("loader", Loader);
Vue.use(VueBreadcrumbs, options);

import filters from "./api/filters";
Object.keys(filters).map(key => {
  Vue.filter(key, filters[key]);
});

import router from "./router";
import store from "./store";

import VuetifyToast from 'vuetify-toast-snackbar';
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
});

import { mapActions, mapGetters } from "vuex";

const createVue = () => {
  new Vue({
    render: h => h(App),
    store,
    router,

    computed: mapGetters({
      games: "speedruncom/games",
      mounted: "speedruncom/mounted",
      streams: "twitch/streams",
    }),

    methods: mapActions({
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
      );

      if (!this.mounted) {
        this.$toast.error("Error loading the games");
      }
    },

    mounted() {
      this.initUpdateLoop();
    }
  }).$mount("#app");
};

/**
 * Update the games into the store before
 * mounting the App
 */
store.dispatch("speedruncom/updateGames").then(() => {
  // Ok
}).catch(() => {
  // Not ok...
}).then(() => {
  createVue();
})