const express = require('express');

const router = express.Router();
const wrapi = require('../bin/wrapi');

const apicache = require('apicache');
const cache = apicache.middleware;
const CACHE_DURATION = '5 minutes';

/**
 * Get world record for a game/category
 * Limited to games from the souls serie
 */
router.get('/:game/:category', cache(CACHE_DURATION), (req, res, next) => {
  const game = req.params.game;
  const category = req.params.category;

  if (!category) {
    next();
    return;
  }

  wrapi.getWorldRecord(game, category)
    .then(wr => res.send(wr))
    .catch(err => next(err));
});

/**
 * Get world record for a game
 * Include misc=true in the query for misc categories
 * Limited to games from the souls serie
 */
router.get('/:game', cache(CACHE_DURATION), (req, res, next) => {
  const game = req.params.game;
  const misc = !!(req.query.misc) && req.query.misc === 'true';
  wrapi.getWorldRecords(game, misc)
    .then(wrs => res.send(wrs))
    .catch(err => next(err));
});

/**
 * Throw an error if no route matched
 */
router.use(() => {
  const error = new Error('Endpoint not found.');
  error.code = 404;
  throw error;
});

/**
 * Custom error handler
 */
router.use((err, req, res, next) => {
  // eslint-disable-next-line
  console.error(err.stack);

  /**
   * Using err.response when the error is caused by speedrun.com
   * Using err.code when the error is caused by our own api or twitch api
   */
  const status = (err.response) ? err.response.status || 500 : err.code || 500;
  const message = err.message || 'Something went terribly wrong here.';
  res.status(status).send(`${status} | ${message}`);
});

module.exports = router;
