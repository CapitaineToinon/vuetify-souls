import Vue from "vue";
import Vuex from "vuex";

import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  state: {
    timingMethodsNames: {
      ingame: "In-Game Time",
      realtime: "Real Time",
      realtime_noloads: "Time without loads"
    }
  },
  mutations: {},
  actions: {},
  getters: {
    timingMethodsNames: state => state.timingMethodsNames,
  }
});
