import Vue from 'vue';
import Vuex from 'vuex';

import 'es6-promise/auto';

Vue.use(Vuex);

/**
 * Node JS SpeedSouls API
 */
const api = require('../api').default;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        games: [],
        timingMethodsNames: {
            realtime: 'Real Time',
            realtime_noloads: 'Real Time no Load',
            ingame: 'In-game Time',
        },
        timingMethodToFix: 'realtime_noloads',
    },
    mutations: {
        _setGames(state, games) {
            state.games = games;
        },
        _deleteGames(state) {
            state.games = [];
        },
    },
    actions: {
        // eslint-disable-next-line
        updateGames({ commit, state }, payload) {
            api.getGames().then((games) => {
                commit('_setGames', games.data);
            }).catch(err => console.log(err));
        },
        // eslint-disable-next-line
        deleteGames({ commit, state }, payload) {
            commit('_deleteGames');
        },
    },
    getters: {
        Games: state => state.games,
        Mounted: state => state.games.length > 0,
    },
});
