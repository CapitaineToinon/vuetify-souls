import api from "../../api/twitch";
import co from "co";

export default {
  namespaced: true,

  state: {
    error: false,
    isLoading: true,
    streams: []
  },

  mutations: {
    _setIsLoading(state, value) {
      state.isLoading = value;
    },

    _setStreams(state, streams) {
      state.streams = streams;
    },

    _setError(state, value) {
      state.error = value;
    }
  },

  actions: {
    updateStreams({ commit }) {
      return co(function*() {
        commit("_setIsLoading", true);
        const streams = yield api.getLiveRunners();
        commit("_setStreams", streams);
        commit("_setError", false);
      }).catch(() => {
        commit("_setError", true);
      }).finally(() => {
        commit("_setIsLoading", false);
      })
    },
  },

  getters: {
    streams: state => state.streams,
    isLoading: state => state.isLoading,
    error: state => state.error,
  }
};
