import { BASE_URL } from "./consants";
import axios from "axios";
import co from "co";


/**
 * Relative api echo
 */
const e = path => axios.get(`${BASE_URL}${path}`);

/**
 * Get souls games
 */
const getGames = () => e("/games").then(games => games.data)

/**
 * Get leaderboard for a game/category
 * If the game has subcategories it needs to be specified
 */
const getLeaderboard = (game, category, subCategories) =>
  co(function* () {
    const subcategories = subCategories.map(
      subc => `var-${subc.id}=${subc.value}`
    );

    const url = `/leaderboard/${game}/${category}?${subcategories.join("&")}`;

    const leaderboard = yield e(url).then(d => d.data);
    return leaderboard;
  });

const getRun = (id) =>  e(`/runs/${id}`).then(d => d.data);

const getRecentRuns = () => e('/recentruns').then(d => d.data);

export default {
  getGames,
  getLeaderboard,
  getRun,
  getRecentRuns,
};
