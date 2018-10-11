const moment = require('moment');
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

const getWorldRecord = (game, category) => src.getWorldRecord(game, category)
    .then(wr => formatWorldRecord(wr));

const getWorldRecords = (game, misc) => src.getWorldRecords(game, misc)
    .then((wrs) => {
        const formatted = wrs.map(wr => formatWorldRecord(wr));
        return formatted.join(' | ');
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
