import Vue from "vue";
import Vuex from "vuex";

import modules from "./modules";

Vue.use(Vuex);

export default new Vuex.Store({
  modules,

  state: {
    darktheme: JSON.parse(localStorage.getItem('darktheme')) || true,
  },

  mutations: {
    setDarkTheme(state, value) {
      state.darktheme = value
      localStorage.setItem('darktheme', JSON.stringify(value));
    }
  },


  actions: {
    init({ commit }) {
      commit('setDarkTheme', JSON.parse(localStorage.getItem('darktheme')) || true);
    },
    enableDarkTheme({ commit }) {
      commit('setDarkTheme', true);
    },
    disableDarkTheme({ commit }) {
      commit('setDarkTheme', false);
    }
  },

  getters: {
    darktheme: state => state.darktheme,
  }
});
