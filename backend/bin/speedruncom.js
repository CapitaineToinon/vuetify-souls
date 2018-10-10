const cachios = require('cachios');
const co = require('co');

const BASE_URL = 'https://www.speedrun.com/api/v1';
const SERIE_NAME = 'souls';
const CACHE_DURATION = 5 * 60; // 5 minutes
const TIMEOUT_LIMIT = 10 * 1000; // 10 seconds

/**
 * =========================================>>
 * ECHOS
 * =========================================>>
 */
const echoAbsolute = url => cachios.get(url, {
    timeout: TIMEOUT_LIMIT,
    ttl: CACHE_DURATION,
}).then(resp => resp.data);
const e = path => echoAbsolute(`${BASE_URL}${path}`);

/**
 * =========================================>>
 * COMPUTED
 * =========================================>>
 */

/**
 * Get Souls Games
 */
const getSoulsGames = () => e(`/series/${SERIE_NAME}/games?embed=categories,variables,platforms`)
    .then(serie => serie.data);

/**
 * Get a Souls Run
 */
const getRun = id => new Promise((resolve, reject) => {
    co(function* () {
        const games = yield getSoulsGames();
        const run = yield e(`/runs/${id}?embed=players`);

        /**
         * Reject runs not from the souls serie
         */
        if (!games.find(g => g.id === run.data.game)) {
            const error = new Error('Run not found.');
            error.code = 404;
            throw error;
        }

        resolve(run);
    }).catch(err => reject(err));
});

/**
 * Get leaderboard
 */
const getLeaderboard = (game, category, subCategories) => new Promise((resolve, reject) => {
    co(function* () {
        const games = yield getSoulsGames();

        /**
         * Reject games not from the souls serie
         */
        if (!games.find(g => g.id === game || g.abbreviation === game)) {
            const error = new Error('Game not found.');
            error.code = 404;
            throw error;
        }

        const url = `${`/leaderboards/${game}/category/${category}`
            + '?embed=players,variables&'}${subCategories.join('&')}`;

        const leaderboard = yield e(url).then(l => l.data);
        resolve(leaderboard);
    }).catch(err => reject(err));
});

/**
 * =========================================>>
 * EXPORTS
 * =========================================>>
 */
module.exports = {
    getSoulsGames,
    getLeaderboard,
    getRun,
};
