import api from "../../api/twitch";
import co from "co";

export default {
  namespaced: true,

  state: {
    isLoading: true,
    streams: []
  },

  mutations: {
    _setIsLoading(state, value) {
      state.isLoading = value;
    },

    _setStreams(state, streams) {
      state.streams = streams;
    }
  },

  actions: {
    updateStreams({ commit }) {
      return co(function*() {
        commit("_setIsLoading", true);
        const streams = yield api.getLiveRunners();
        commit("_setStreams", streams);
        commit("_setIsLoading", false);
      });
    },
  },

  getters: {
    streams: state => state.streams,
    isLoading: state => state.isLoading,
  }
};
