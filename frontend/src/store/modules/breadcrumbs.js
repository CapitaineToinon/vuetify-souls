export default {
  namespaced: true, 

  state: {
    breadcrumbs: []
  },

  mutations: {
    _setBreadcrumbs(state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs;
    }
  },

  actions: {
    setBreadcrumbs({ commit }, breadcrumbs) {
      commit("_setBreadcrumbs", breadcrumbs);
    },
  },

  getters: {
    breadcrumbs: state => state.breadcrumbs,
  }
};