const co = require('co');
const axios = require('axios');
const BASE_KRAKEN_URL = 'https://api.twitch.tv/kraken';
const BASE_HELIX_URL = 'https://api.twitch.tv/helix';
const TEAM = 'speedsouls';
const HELIX_MAX = 100;
const KRAKEN_HEADERS = {
  headers: {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': process.env.TWITCH_CLIENT_ID,
  },
};
const HELIX_HEADERS = {
  headers: {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
  },
};

/**
 * Twitch API v5 - deprecated
 */
const krakenAbsolute = url => axios.get(url, KRAKEN_HEADERS).then(resp => resp.data);
const kraken = path => krakenAbsolute(`${BASE_KRAKEN_URL}${path}`);

/**
 * New Twitch API
 */
const helixAbsolute = url => axios.get(url, HELIX_HEADERS).then(resp => resp.data);
const helix = path => helixAbsolute(`${BASE_HELIX_URL}${path}`);

/**
 * The helix API allows to specify up to a 100 ids at once
 * so we split in groups of 100 or less
 * @param {*} array 
 */
const splitInGroups = array => {
  const groups = [];

  array.forEach((id, index) => {
    const groupIndex = parseInt(index / HELIX_MAX);
    const currentGroup = groups[groupIndex] || [];
    groups[groupIndex] = [...currentGroup, id];
  })

  return groups;
}

/**
 * Return the members of a TEAM
 * Using the old api that is deprecated
 */
const getSpeedSoulsTeam = () => kraken(`/teams/${TEAM}`);

/**
 * Retuns an array of users
 * @param {array} userIds 
 */
const getUsers = userIds => co(function* () {
  const groups = splitInGroups(userIds);

  const users = yield groups.map(group => {
    const query = group.map(id => `id=${id}`).join('&')
    return helix(`/users?${query}`).then(users => users.data);
  });

  return users.reduce((a, val) => [...a, ...val]);
});

/**
 * Returns an array of games
 * @param {array} gameIds 
 */
const getGames = gameIds => co(function* () {
  const groups = splitInGroups(gameIds);

  const games = yield groups.map(group => {
    const query = group.map(id => `id=${id}`).join('&')
    return helix(`/games?${query}`).then(games => games.data);
  });

  return games.reduce((a, val) => [...a, ...val]);
})

/**
 * Returns an array of streams
 * Adding game and user object
 * @param {array} channelIds 
 */
const getStreams = channelIds => co(function* () {
  const groups = splitInGroups(channelIds);

  let streams = yield groups.map(group => {
    const query = group.map(id => `user_id=${id}`).join('&')
    return helix(`/streams?${query}`).then(stream => stream.data);
  });

  return streams.reduce((a, val) => [...a, ...val]);
});

/**
 * Get the live streams from the speedsouls team
 */
const getLiveStreams = () => co(function* () {
  const team = yield getSpeedSoulsTeam();
  const channelIds = team.users.map(u => u._id);
  const streams = yield getStreams(channelIds)

  const gamesIds = [...new Set(streams.map(stream => stream.game_id))];
  const userIds = streams.map(stream => stream.user_id);

  const { games, users } = yield {
    games: getGames(gamesIds),
    users: getUsers(userIds),
  };

  return streams.map(stream => {
    return {
      ...stream,
      game: games.find(g => g.id === stream.game_id),
      user: users.find(u => u.id === stream.user_id),
    }
  })
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
