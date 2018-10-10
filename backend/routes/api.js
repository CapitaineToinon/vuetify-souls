const express = require('express');
const co = require('co');

const router = express.Router();
const src = require('../bin/speedruncom');
const twitch = require('../bin/twitch');

/**
 * const
 */
const BASE_URI = 'http://localhost:3000';

router.get('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/', (req, res) => {
    res.json({
        links: {
            rel: 'self',
            uri: `${BASE_URI}/api`,
        },
    });
});

router.get('/games', (req, res, next) => {
    src.getSoulsGames()
        .then(games => res.json(games))
        .catch(err => next(err));
});

router.get('/runs/:id', (req, res, next) => {
    src.getRun(req.params.id)
        .then(run => res.json(run))
        .catch(err => next(err));
});

router.get('/leaderboard/:game/:category', (req, res, next) => {
    const subCategories = Object.entries(req.query)
        .filter((item, key) => Object.keys(req.query)[key].startsWith('var-'))
        .map(([key, value]) => `${key}=${value}`);

    src.getLeaderboard(req.params.game, req.params.category, subCategories)
        .then(leaderboard => res.json(leaderboard))
        .catch(err => next(err));
});

router.get('/livestreams', (req, res, next) => {
    co(function* () {
        const games = yield src.getSoulsGames();
        const streams = yield twitch.getLiveStreams();

        /**
         * Exclude streams not playing a souls game
         */
        const gamesTwitchNames = games.map(g => g.names.twitch);
        const soulsStreams = streams.filter(s => gamesTwitchNames.includes(s.game));
        res.json(soulsStreams);
    }).catch(err => next(err));
});

router.get('*', () => {
    const error = new Error('Error');
    error.code = 404;
    throw error;
});

module.exports = router;
