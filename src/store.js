import Vue from 'vue'
import Vuex from "vuex"

import 'es6-promise/auto'
Vue.use(Vuex)

/**
 * Node JS SpeedSouls API
 */
var api = require('./api').default

export default new Vuex.Store({
    state: {
        games: [],
        timingMethodsNames: {
            realtime: 'Real Time',
            realtime_noloads: 'Real Time no Load',
            ingame: 'In-game Time'
        }
    },
    actions: {},
    mutations: {
        updateGames(state) {
            api.getGames((error, games) => {
                if (error) return console.log('Error with the API')

                state.games = []
                for (var g in games.data) {
                    state.games.push(games.data[g])
                }
            })
        },
        clearGames(state) {
            state.games = []
        }
    },
    getters: {
        Games: state => state.games,
        getGameByAbb: (state) => (abb) => {
            var index = state.games.findIndex(g => g.abbreviation === abb)
            return index !== -1 ? state.games[index] : index;
        },
        gamesCount: (state, getters) => {
            return state.games.length
        },
        Mounted: (state, getters) => getters.gamesCount > 0
    },
})