import api from "../../api/speedruncom";
import co from "co";

export default {
  namespaced: true,

  state: {
    games: []
  },

  mutations: {
    _setGames(state, games) {
      state.games = games;
    }
  },

  actions: {
    updateGames({ commit }) {
      return co(function*() {
        const games = yield api.getGames();
        commit("_setGames", games);
      });
    },
  },

  getters: {
    mounted: state => state.games.length > 0,
    games: state => state.games,
    getGameByAbbreviation: state => abbreviation => {
      return state.games.find(game => game.abbreviation === abbreviation);
    },
    getGameById: state => id => {
      return state.games.find(game => game.id === id);
    }
  }
};
