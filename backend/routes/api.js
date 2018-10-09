const express = require('express');

const router = express.Router();
const api = require('../bin/api');

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
    api.getSoulsGames()
        .then(games => res.json(games))
        .catch(err => next(err));
});

router.get('/runs/:id', (req, res, next) => {
    api.getRun(req.params.id)
        .then(run => res.json(run))
        .catch(err => next(err));
});

router.get('/leaderboard/:game/:category', (req, res, next) => {
    const subCategories = Object.entries(req.query)
        .filter((item, key) => Object.keys(req.query)[key].startsWith('var-'))
        .map(([key, value]) => `${key}=${value}`);

    api.getLeaderboard(req.params.game, req.params.category, subCategories)
        .then(leaderboard => res.json(leaderboard))
        .catch(err => next(err));
});

router.get('*', (req, res, next) => {
    let error = new Error('');
    error.code = 404;
    throw error;
});

module.exports = router;
