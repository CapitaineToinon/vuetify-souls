var request = require('request')
    , cachedRequest = require('cached-request')(request)
    , cacheDirectory = "/tmp/speedsouls/cache"
    , BASE_URL = 'https://www.speedrun.com/api/v1'
    , SERIE_NAME = 'souls'
    , CACHE_DURATION = 1000 * 60;

cachedRequest.setValue('ttl', CACHE_DURATION);
cachedRequest.setCacheDirectory(cacheDirectory);

/**
 * ===================================================================================================================>>
 * ECHOS
 * ===================================================================================================================>>
 */

/**
 *
 * @param url
 * @param cb
 */
function echoAbsolute(url, cb) {
    var options = {
        url: url
    };
    cachedRequest(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            return cb(error || {})
        }

        cb(null, JSON.parse(body));
    });
}

/**
 * Private function that echos speedrun.com api.
 * @param url
 * @param cb
 */
function e(url, cb) {
    echoAbsolute(BASE_URL + url, function (error, game) {
        console.log('ACCESS :', BASE_URL + url)
        cb(error, game);
    })
}

/**
 * ===================================================================================================================>>
 * COMPUTED
 * ===================================================================================================================>>
 */

/**
 * Get Souls Games
 */
function SoulsGames(cb) {
    e('/series/' + SERIE_NAME + '/games?embed=categories', (error, games) => {
        if (error) cb(error)

        cb(null, games)
    })
}

function Leaderboard(game, category, cb) {
    SoulsGames(function (error, games) {
        if (error) cb(error)

        // We only allow games from the souls franchise
        if (games.data.findIndex(g => g.id === game || g.abbreviation === game) !== -1) {
            e('/leaderboards/' + game + '/category/' + category + '?embed=players,variables,platforms', (error, leaderboard) => {
                if (error) cb(error)
                cb(null, leaderboard)
            })
        } else {
            cb({"message": "Game not found"})
        }
    })
}

/**
 * ===================================================================================================================>>
 * EXPORTS
 * ===================================================================================================================>>
 */
module.exports = {
    getHome: (cb) => {
        e('/', (error, game) => {
            if (error) cb(error)

            cb(null, game)
        })
    },
    getSoulsGames: (cb) => {
        SoulsGames((error, serie) => {
            if (error) cb(error)

            cb(null, serie)
        })
    },
    getLeaderboard: (game, category, cb) => {
        Leaderboard(game, category, (error, leaderboard) => {
            if (error) cb(error)

            cb(null, leaderboard)
        })
    }
}