import api from "../../api/twitch";
import co from "co";

const COUNTDOWN_DURATION = 60 * 5;

export default {
  namespaced: true,

  state: {
    error: false,
    isLoading: false,
    countdown: 0,
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
    },

    _setCountdown(state, value) {
      state.countdown = value;
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

    decreaseCountdown({ dispatch, commit, getters }) {
      commit("_setCountdown", getters.countdown - 1)

      if (getters.countdown < 0) {
        dispatch("updateStreams");
        dispatch("resetCountdown");
      }
    },

    resetCountdown({ commit }) {
      commit("_setCountdown", COUNTDOWN_DURATION);
    },

    initUpdateLoop({ dispatch }) {
      (function updateloop() {
        dispatch("decreaseCountdown");
        setTimeout(updateloop, 1000);
      })();
    },
  },

  getters: {
    streams: state => state.streams,
    isLoading: state => state.isLoading,
    countdown: state => state.countdown,
    countdownProgress: state => (state.countdown * 100) / COUNTDOWN_DURATION,
    error: state => state.error,
  }
};
