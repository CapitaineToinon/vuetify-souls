const moment = require('moment');
const co = require('co');
const src = require('./speedruncom');

const formatTime = (value) => {
    const ms = value.toString().split('.').length > 1;
    const time = moment.duration(value, 'seconds');
    const format = `${time.hours() > 0 ? 'H:' : ''}mm:ss${ms ? '.SSS' : ''}`;
    return moment.utc(value * 1000).format(format);
};

const formatWorldRecord = (record) => {
    // The basics
    const category = record.category.data;
    const players = record.players.data;
    // const variables = record.variables.data;
    const run = record.runs[0];

    // Run data
    const categoryName = category.name;
    const runTime = formatTime(run.run.times.primary_t);
    const playerNames = players.map(player => ((player.rel === 'user')
        ? player.names.international
        : player.name)).join(', ');

    return `${categoryName} ${runTime} by ${playerNames}`;
};

const getWorldRecord = (game, category) => new Promise((resolve, reject) => {
    co(function* () {
        const wr = yield src.getWorldRecord(game, category);
        resolve(formatWorldRecord(wr));
    }).catch(err => reject(err));
});

const getWorldRecords = (game, misc) => new Promise((resolve, reject) => {
    co(function* () {
        const worldrecords = yield src.getWorldRecords(game, misc);
        const prettyrecords = worldrecords.map(wr => formatWorldRecord(wr));
        const output = prettyrecords.join(' | ');
        resolve(output);
    }).catch(err => reject(err));
});

/**
 * =========================================>>
 * EXPORTS
 * =========================================>>
 */
module.exports = {
    getWorldRecord,
    getWorldRecords,
};
