import axios from "axios";
import co from "co";

const BASE_URL =
  process.env.NODE_ENV !== "production" ? "http://localhost:3000/api" : "/api";

const e = path => axios.get(`${BASE_URL}${path}`);

const getGames = () => e("/games").then(games => games.data);

/**
 * Get leaderboard for a game/category
 * If the game has subcategories it needs to be specified
 */
const getLeaderboard = (game, category, subCategories) =>
  co(function*() {
    const subcategories = subCategories.map(
      subc => `var-${subc.id}=${subc.value}`
    );

    const url = `/leaderboard/${game}/${category}?${subcategories.join("&")}`;

    const leaderboard = yield e(url).then(d => d.data);
    return leaderboard;
  });

export default {
  getGames,
  getLeaderboard
};
