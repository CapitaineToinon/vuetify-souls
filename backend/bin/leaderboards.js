const timingMethodsNames = {
  ingame: "In-Game Time",
  realtime: "Real Time",
  realtime_noloads: "Time without loads"
};

const formatPlayer = player => {
  /**
 * Name and flag
 */
  let name = "";
  let country = false;
  let nameStyle = false;
  let weblink = false;

  if (player.hasOwnProperty("id")) {
    name = player.names.international;

    if (player.location !== null) {
      country = player.location.country;
      country.code = player.location.country.code.split(
        "/"
      )[0];
    }

    nameStyle = formatNameStyle(player["name-style"]);

    weblink = player.weblink;
  } else {
    /**
     * Guest player
     */
    name = player.name;
  }

  return {
    name,
    country,
    nameStyle,
    weblink
  };
}

const ordinal = i => {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

const formatNameStyle = (namestyle) => {
  let style = null;

  switch (namestyle.style) {
    case "gradient":
      style = {
        background: `-webkit-linear-gradient(0deg, ${
          namestyle["color-from"].dark
          }, ${namestyle["color-to"].dark})`,
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent"
      };
      break;
    case "solid":
      style = {
        background: `-webkit-linear-gradient(0deg, ${
          namestyle["color"].dark
          }, ${namestyle["color"].dark})`,
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent"
      };
      break;
    default:
      style = {};
      break;
  }

  return style;
}

/**
 * Formats the data for the leaderboards
 * Returns {
 *      headers,
 *      runs,
 * }
 * @param {*} game 
 * @param {*} category 
 * @param {*} runs 
 * @param {*} players 
 */
const formatLeaderboardsData = (game, category, runs, players) => {
  const rank_h = {
    sortable: false,
    align: "center",
    text: "Rank",
    value: "rank"
  };

  const player_h = {
    sortable: false,
    align: "center",
    text: "Player",
    value: "player"
  };

  const mobile_timing_h = {
    sortable: false,
    align: "center",
    text: "Time",
    value: "mobile_time",
    class: "hidden-lg-and-up",
  };

  const default_timing_h = {
    sortable: false,
    align: "center",
    text: timingMethodsNames[game.ruleset["default-time"]],
    value: game.ruleset["default-time"],
    class: "hidden-md-and-down",
  };

  const others_timing_h = game.ruleset["run-times"]
    .filter(timingMethod => {
      return timingMethod !== game.ruleset["default-time"];
    })
    .map(t => {
      return {
        sortable: false,
        align: "center",
        text: timingMethodsNames[t],
        value: t,
        class: "hidden-md-and-down",
      };
    });

  // Getting all the variables that aren't sub categories
  const variables_h = game.variables.data
    .filter(variable => {
      return (
        variable.category === category.id &&
        !variable["is-subcategory"]
      );
    })
    .map(v => {
      return {
        sortable: false,
        align: "center",
        text: v.name,
        value: v.id,
        class: "hidden-md-and-down",
      };
    });

  const date_h = {
    sortable: false,
    align: "center",
    text: "Date",
    value: "date",
    class: "hidden-md-and-down",
  };

  const vod_h = {
    sortable: false,
    align: "center",
    text: "",
    value: "vod",
    class: "hidden-md-and-down",
  };

  const headers = [
    rank_h,
    player_h,
    mobile_timing_h,
    default_timing_h,
    ...others_timing_h,
    ...variables_h,
    date_h,
    vod_h,
  ];

  const formattedruns = runs.map(run => {
    // Player's rank
    const place = ordinal(run.place);

    // Rank's trophy
    const trophy_name = `trophy-${place}`;
    const trophy =
      game.assets[trophy_name] !== undefined &&
        game.assets[trophy_name] !== null
        ? game.assets[trophy_name].uri
        : false;

    // Run's date
    const date = run.run.date;

    // Player(s)
    const players_names = run.run.players.map(p1 => {
      const player = (p1.hasOwnProperty("id")) 
        ? players.find(p2 => p2.id === p1.id)
        : p1;

      return formatPlayer(player);
    });

    // Primaty timing method according to the run
    const primary_t = run.run.times["primary_t"];

    /**
     * Primary timing method according to the game object
     * Needs to do manual times for categories using realtime_noloads
     * because of a bug in the API.
     *
     * If the category is glitched, we need to check if the run we're
     * looking at has a realtime_noloads time and no realtime time.
     * If that's the case, realtime_noloads will be set to 0 and the
     * actual time will be in realtime so we need to swap those two.
     *
     * If the run has both realtime_nolaod and realtime, then it's good.
     *
     * Because of how the leaderboards are organized by the game's mods,
     * a run cannot have a realtime but no realtime_noloads.
     *
     * See : https://github.com/speedruncomorg/api/issues/69
     */
    const BUGGED_NAME = "realtime_noloads";
    const defaultTimeName = game.ruleset["default-time"];

    /**
     * Category's default timing methods. If it matches BUGGED_NAME
     * AND if ${BUGGED_NAME}_t is 0, we're fucked
     */
    const NEEDSFIXING =
      defaultTimeName === BUGGED_NAME &&
      run.run.times[`${defaultTimeName}_t`] === 0;

    // If we need to fix it, ignore default-time and use primary_t insead
    const default_t = NEEDSFIXING
      ? primary_t
      : run.run.times[`${game.ruleset["default-time"]}_t`];

    // Other timing methods' names, if any
    const othersTimeNames = game.ruleset["run-times"].filter(
      timingMethod => {
        return timingMethod !== game.ruleset["default-time"];
      }
    );

    /**
     * Actual other timing methods
     * If we need to fix it, then we ignore it and return a 0 time instead
     */
    const other_t = othersTimeNames.map(runTime => {
      return NEEDSFIXING ? 0 : run.run.times[`${runTime}_t`];
    });

    // Getting all the variables that aren't sub categories
    const variables = game.variables.data.filter(variable => {
      return (
        variable.category === category.id &&
        !variable["is-subcategory"]
      );
    });

    // Get the actual values for each of variable
    const values = variables.map(variable => {
      const key = Object.keys(run.run.values).find(
        key => variable.id === key
      );

      return key === undefined
        ? "-"
        : variable.values.values[run.run.values[key]].label;
    });

    // Show the icon or not
    const showicon = run.run.videos !== null;

    // Object ready for rendering
    return outputRun = {
      place,
      trophy,
      players: players_names,
      default_t,
      primary_t,
      other_t,
      values,
      date,
      showicon,
      run
    };
  });

  return {
    headers,
    runs: formattedruns,
  }
}

module.exports = {
  formatPlayer,
  formatLeaderboardsData,
}