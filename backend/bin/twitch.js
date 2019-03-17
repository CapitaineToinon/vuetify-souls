const cachios = require('cachios');
const co = require('co');

const BASE_URL = 'https://api.twitch.tv/kraken';
const TEAM = 'speedsouls';
const CACHE_DURATION = 5 * 60; // 5 minutes
const TIMEOUT_LIMIT = 10 * 1000; // 10 seconds
const HEADERS = {
  headers: {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': process.env.TWITCH_CLIENT_ID,
  },
};

/**
 * =========================================>>
 * ECHOS
 * =========================================>>
 */
const echoAbsolute = url => cachios.get(url, HEADERS, {
  timeout: TIMEOUT_LIMIT,
  ttl: CACHE_DURATION,
}).then(resp => resp.data);
const e = path => echoAbsolute(`${BASE_URL}${path}`);

/**
 * =========================================>>
 * COMPUTED
 * =========================================>>
 */
const getSpeedSoulsTeam = () => e(`/teams/${TEAM}`);

const getStream = channelId => e(`/streams/${channelId}`)
  .then(stream => stream.stream);

const getLiveStreams = () => co(function* () {
  // throw new Error('Testing the errors');
  const team = yield getSpeedSoulsTeam();
  const streams = yield team.users.map(user => getStream(user._id)); // eslint-disable-line
  return streams.filter(stream => stream !== null);
});

/**
 * =========================================>>
 * EXPORTS
 * =========================================>>
 */
module.exports = {
  getSpeedSoulsTeam,
  getLiveStreams,
};
