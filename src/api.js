import axios from 'axios'

const DEBUG = true
const ERROR_CODE = 466

const _ = function (uri) {
    return (DEBUG) ? 'http://localhost:3000/api' + uri : '/api' + uri
}

function formatSubCateogiresURI(subCategories) {
    var output = []
    subCategories.forEach(sc => {
        if (sc.current !== -1)
            output.push('var-' + sc.id + '=' + sc.current)
    })
    return output.join('&')
}

export default {
    getGames: (cb) => {
        axios.get(_('/games')).then((response) => {
            if (response.status === ERROR_CODE) return cb({"status": ERROR_CODE})
            cb(null, response.data)
        }).catch((error) => {
            cb(error)
        })
    },
    getLeaderboard: (game, category, subCategories, cb) => {
        axios.get(_('/leaderboard/' + game + '/' + category + '?' + formatSubCateogiresURI(subCategories))).then((response) => {
            if (response.status === ERROR_CODE) return cb({"status": ERROR_CODE})
            cb(null, response.data)
        }).catch((error) => {
            cb(error)
        })
    }
}