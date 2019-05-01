const co = require('co');
const axios = require('axios');
const BASE_URL = 'https://www.speedrun.com/api/v1';
const SERIE_NAME = 'souls';

const leaderboard = require('./leaderboards')

/**
 * =========================================>>
 * ECHOS
 * =========================================>>
 */
const echoAbsolute = url => axios.get(url).then(resp => resp.data);
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
const getSoulsGame = game => getSoulsGames()
  .then(games => games.find(g => g.id === game
    || g.abbreviation === game
    || g.names.twitch === game));

/**
 * Get a run
 * Limited to runs from the souls serie
 */
const getRun = id => co(function* () {
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

  return run;
});

/**
 * Get leaderboard for a game/category
 * If the game has subcategories it needs to be specified
 */
const getLeaderboard = (game, category, subCategories) => co(function* () {
  const thegame = yield getSoulsGame(game);

  /**
   * Reject games not from the souls serie
   */
  if (!thegame) {
    const error = new Error('Game not found.');
    error.code = 404;
    throw error;
  }

  const url = `/leaderboards/${game}/category/${category}`
    + `?embed=players,variables&${subCategories.join('&')}`;

  const data = yield e(url).then(l => l.data);
  const { runs, players } = data;
  const thecategory = thegame.categories.data.find(c => c.id === data.category);

  return leaderboard.formatLeaderboardsData(thegame, thecategory, runs, players.data);
});

/**
 * Get World Record for a game and category
 * No need to specify subcategories, we just use the default values
 */
const getWorldRecord = (game, category) => co(function* () {
  const thegame = yield getSoulsGame(game);

  if (!thegame) {
    const error = new Error('Game not found.');
    error.code = 404;
    throw error;
  }

  const thecategory = thegame.categories.data.find(c => (c.id === category
    || c.name === category
    || c.weblink.split('#')[1].toLowerCase() === category.toLowerCase()));

  if (!thecategory) {
    const error = new Error('Category not found.');
    error.code = 404;
    throw error;
  }

  const variables = thegame.variables.data.filter(f => f.category === thecategory.id && f['is-subcategory']);

  const gid = thegame.id;
  const cid = thecategory.id;
  const subc = variables.map(v => `var-${v.id}=${v.values.default}`);

  const url = `/leaderboards/${gid}/category/${cid}`
    + `?embed=players,variables,category&top=1&${subc.join('&')}`;

  const wordrecord = yield e(url).then(wr => wr.data);
  return wordrecord;
});

/**
 * Get World Records for a game
 */
const getWorldRecords = (game, misc) => co(function* () {
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
  return worldrecords;
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
