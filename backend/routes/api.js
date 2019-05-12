const express = require('express');
const co = require('co');

const router = express.Router();
const src = require('../bin/speedruncom');
const twitch = require('../bin/twitch');

const BASE_URI = 'http://localhost:3000';
const cache = require("../bin/cache");

/**
 * API root
 */
router.get('/', (req, res) => {
  res.json({
    links: [
      {
        rel: 'self',
        uri: `${BASE_URI}/api`,
      },
      {
        rel: 'games',
        uri: `${BASE_URI}/api/games`,
      },
      {
        rel: 'livestreams',
        uri: `${BASE_URI}/api/livestreams`,
      },
    ],
  });
});

/**
 * List of souls games
 * https://www.speedrun.com/souls
 */
router.get('/games', (req, res, next) => {
  cache(req.originalUrl, (() => {
    return src.getSoulsGames().then(games => {
      games.forEach(game => {
        src.downloadBackground(game, "backgrounds");
      });
      return games;
    });
  }))
    .then(games => res.json(games))
    .catch(err => next(err));
});

/**
 * Get a game's background image
 */
router.get('/background/:name', (req, res, next) => {
  var options = {
    root: __dirname + '/../backgrounds/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  const { name } = req.params;
  res.sendFile(name, options, (err) => {
    if (err) {
      error = new Error(err.code);
      error.code = err.status;
      next(error);
    }
  });
});

/**
 * Get a run
 * Limited to runs from the souls serie
 */
router.get('/runs/:id', (req, res, next) => {
  // Will be deleted when data expires
  const options = {
    deleteOnExpire: true,
  };

  cache(req.originalUrl, src.getRun, [req.params.id], options)
    .then(run => res.json(run))
    .catch(err => next(err));
});

/**
 * Get a run
 * Limited to runs from the souls serie
 */
router.get('/recentruns', (req, res, next) => {
  cache(req.originalUrl, src.getRecentRuns)
    .then(run => res.json(run))
    .catch(err => next(err));
});

/**
 * Get leaderboards for a game/category
 * Limited to games from the souls serie
 */
router.get('/leaderboard/:game/:category', (req, res, next) => {
  const subCategories = Object.entries(req.query)
    .filter((item, key) => Object.keys(req.query)[key].startsWith('var-'))
    .map(([key, value]) => `${key}=${value}`);

  cache(req.originalUrl, src.getLeaderboard, [req.params.game, req.params.category, subCategories])
    .then(leaderboard => res.json(leaderboard))
    .catch(err => next(err));
});

/**
 * Get live streams from the speedsouls team
 * Limited to games from the souls serie
 * https://www.twitch.tv/team/speedsouls
 */
router.get('/liverunners', (req, res, next) => {
  cache(req.originalUrl, () => {
    return co(function* () {
      const streams = yield twitch.getLiveStreams();
      const games = yield src.getSoulsGames();

      /**
       * Exclude streams not playing a souls game
       */
      const gamesTwitchNames = games.map(g => g.names.twitch);
      const soulsStreams = streams.filter(s => gamesTwitchNames.includes(s.game));
      return soulsStreams
    })
  })
    .then(streams => res.json(streams))
    .catch(err => next(err));
});

/**
 * Get Team
 */
router.get('/team', (req, res, next) => {
  cache(req.originalUrl, twitch.getSpeedSoulsTeam)
    .then(team => res.json(team))
    .catch(err => next(err));
});

/**
 * Get world record for a game/category
 * Limited to games from the souls serie
 */
// router.get('/wr/:game/:category', (req, res, next) => {
//   const game = req.params.game;
//   const category = req.params.category;
//   if (!category) {
//     next();
//     return;
//   }
//   src.getWorldRecord(game, category)
//     .then(wr => res.json(wr))
//     .catch(err => next(err));
// });

/**
 * Get world record for a game
 * Include misc=true in the query for misc categories
 * Limited to games from the souls serie
 */
// router.get('/wr/:game', (req, res, next) => {
//   const game = req.params.game;
//   if (!game) {
//     next();
//     return;
//   }
//   const misc = !!(req.query.misc) && req.query.misc === 'true';
//   src.getWorldRecords(game, misc)
//     .then(wrs => res.json(wrs))
//     .catch(err => next(err));
// });

/**
 * Get world record for all souls games
 * Include misc=true in the query for misc categories
 */
// router.get('/wr', (req, res, next) => {
//   co(function* () {
//     const misc = !!(req.query.misc) && req.query.misc === 'true';
//     const games = yield src.getSoulsGames();
//     const records = yield games.map(g => ({
//       game: g,
//       records: src.getWorldRecords(g.id, misc),
//     }));
//     res.json(records);
//   }).catch(err => next(err));
// });

/**
 * Throw an error if no route matched
 */
router.use(() => {
  const error = new Error('Endpoint not found.');
  error.code = 404;
  throw error;
});

/**
 * Custom JSON error handler
 */
router.use((err, req, res, next) => {
  // eslint-disable-next-line
  console.error(err.stack);
  /**
   * Using err.response when the error is caused by speedrun.com
   * Using err.code when the error is caused by our own api or twitch api
   */
  const status = (err.response) ? err.response.status || 500 : err.code || 500;
  const statusText = (err.response) ? err.response.statusText || '' : '';
  const message = err.message || '';
  res.status(status).json({
    status,
    statusText,
    message,
  });
});

module.exports = router;
