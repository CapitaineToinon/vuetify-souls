const express = require('express');

const router = express.Router();
const wrapi = require('../bin/wrapi');

router.get('/:game/:category', (req, res, next) => {
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

router.get('/:game', (req, res, next) => {
    const game = req.params.game;
    const misc = !!(req.query.misc);
    wrapi.getWorldRecords(game, misc)
        .then(wrs => res.send(wrs))
        .catch(err => next(err));
});

module.exports = router;
