/**
 * Requires
 */
var express = require('express')
var router = express.Router()
var api = require('../bin/api')
var Handler = require('../bin/errors')

/**
 * const
 */
const BASE_URI = 'http://localhost:3000'
const HandleError = function(error, res) {
    res.status(Handler.STATUS_CODE).json(new Handler.Error(error.message))
}

router.get('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    next()
})

router.get('/', function (req, res, next) {
    res.json({
        "links": {
            "rel": "self",
            "uri": BASE_URI + "/api"
        }
    })
})

router.get('/home', function (req, res, next) {
    api.getHome((error, game) => {
        if (error) return HandleError(error, res)
        res.json(game)
    })
})

router.get('/games', function (req, res, next) {
    api.getSoulsGames((error, games) => {
        if (error) return HandleError(error, res)
        res.json(games)
    })
})

router.get('/leaderboard/:game/:category', function(req, res, next) {

    var subCategories = []
    for(var q in req.query) {
        if (q.startsWith('var-')) {
            subCategories.push(q + '=' + req.query[q])
        }
    }

    api.getLeaderboard(req.params.game, req.params.category, subCategories, (error, leaderboard) => {
        if (error) return HandleError(error, res)
        res.json(leaderboard)
    })
})

module.exports = router;
