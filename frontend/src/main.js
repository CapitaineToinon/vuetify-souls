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
    this.getGames().then(() => {
      /* eslint-disable-next-line */
      console.log("Games properly loaded from main.js", this.games);
      console.log(process.env.NODE_ENV);
    });
  }
}).$mount("#app");
