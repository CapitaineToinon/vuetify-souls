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
 * Get a game from the souls serie
 */
const getSoulsGame = game => new Promise((resolve, reject) => {
    co(function* () {
        const games = yield getSoulsGames();
        const thegame = games.find(g => g.id === game
            || g.abbreviation === game
            || g.names.twitch === game);

        resolve(thegame);
    }).catch(err => reject(err));
});

/**
 * Get a run
 * Limited to runs from the souls serie
 */
const getRun = id => new Promise((resolve, reject) => {
    co(function* () {
        const run = yield e(`/runs/${id}?embed=players`);
        const game = yield getSoulsGame(run.data.game);

        /**
         * Reject runs not from the souls serie
         */
        if (!game) {
            const error = new Error('Run not found.');
            error.code = 404;
            throw error;
        }

        resolve(run);
    }).catch(err => reject(err));
});

/**
 * Get leaderboard for a game/category
 * If the game has subcategories it needs to be specified
 */
const getLeaderboard = (game, category, subCategories) => new Promise((resolve, reject) => {
    co(function* () {
        const thegame = yield getSoulsGame(game);

        /**
         * Reject games not from the souls serie
         */
        if (!thegame) {
            const error = new Error('Game not found.');
            error.code = 404;
            throw error;
        }

        const url = `/leaderboards/${game}/category/${category}
            ?embed=players,variables&'}${subCategories.join('&')}`;

        const leaderboard = yield e(url).then(l => l.data);
        resolve(leaderboard);
    }).catch(err => reject(err));
});

/**
 * Get World Record for a game and category
 * No need to specify subcategories, we just use the default values
 */
const getWorldRecord = (game, category) => new Promise((resolve, reject) => {
    co(function* () {
        const thegame = yield getSoulsGame(game);
        const thecategory = thegame.categories.data.find(c => (c.id === category
            || c.name === category
            || c.weblink.split('#')[1].toLowerCase() === category.toLowerCase()));

        /**
         * Reject games not from the souls serie
         */
        if (!thegame || !thecategory) {
            const error = new Error('Game or category not found.');
            error.code = 404;
            throw error;
        }

        const variables = thegame.variables.data.filter(f => f.category === thecategory.id && f['is-subcategory']);

        const gameid = thegame.id;
        const categoryid = thecategory.id;
        const subCategories = variables.map(v => `var-${v.id}=${v.values.default}`);

        const url = `/leaderboards/${gameid}/category/${categoryid}
            ?embed=players,variables,category&top=1&${subCategories.join('&')}`;

        const wordrecord = yield e(url).then(wr => wr.data);
        resolve(wordrecord);
    }).catch(err => reject(err));
});

/**
 * Get World Records for a game
 */
const getWorldRecords = (game, misc) => new Promise((resolve, reject) => {
    co(function* () {
        const thegame = yield getSoulsGame(game);

        if (!thegame) {
            const error = new Error('Game not found.');
            error.code = 404;
            throw error;
        }

        const categories = (misc)
            ? thegame.categories.data
            : thegame.categories.data.filter(c => c.miscellaneous === false);

        const worldrecords = yield categories.map(c => getWorldRecord(thegame.id, c.id));
        resolve(worldrecords);
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
    getWorldRecord,
    getWorldRecords,
};
