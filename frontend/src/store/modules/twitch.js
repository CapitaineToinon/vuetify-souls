import api from "../../api/twitch";
import co from "co";

export default {
  namespaced: true,

  state: {
    streams: []
  },

  mutations: {
    _setStreams(state, streams) {
      state.streams = streams;
    }
  },

  actions: {
    updateStreams({ commit }) {
      return co(function*() {
        const streams = yield api.getLiveRunners();
        commit("_setStreams", streams);
      });
    },
  },

  getters: {
    streams: state => state.streams,
  }
};
