<template>
  <v-data-table :headers="headers" :items="formattedRuns" class="elevation-1" hide-actions>
    <template v-slot:items="props">
      <tr :active="props.selected" @click="onRunClick(props.item.run)" class="run-row">
        <td class="text-xs-center">
          <v-layout justify-center align-center>
            <v-flex v-if="props.item.trophy">
              <v-img :src="props.item.trophy" height="16" width="16"/>
            </v-flex>
            <v-flex>
              <span>{{ props.item.place | ordinal }}</span>
            </v-flex>
          </v-layout>
        </td>
        <td class="text-xs-center">
          <div v-for="(player, i) in props.item.players" :key="`player-${i}`">
            <v-tooltip v-if="player.country" bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on" :class="`flag-icon flag-icon-${player.country.code}`"></span>
              </template>
              <span>{{ player.country.names.international }}</span>
            </v-tooltip>
            <span
              v-if="player.weblink"
              @click.stop="onPlayerClick(player)"
              target="_blank"
              class="font-weight-bold username ml-1"
              v-bind:style="[player.nameStyle]"
            >{{ player.name }}</span>
            <span v-else>{{ player.name }}</span>
          </div>
        </td>
        <td class="text-xs-center hidden-lg-and-up">{{ props.item.primary_t | formatTime }}</td>
        <td class="text-xs-center hidden-md-and-down">{{ props.item.default_t | formatTime }}</td>
        <td
          v-for="(time, i) in props.item.other_t"
          :key="`time-${i}`"
          class="text-xs-center hidden-md-and-down"
        >{{ time | formatTime }}</td>
        <td
          v-for="(val, i) in props.item.values"
          :key="`var-${i}`"
          class="text-xs-center hidden-md-and-down"
        >{{ val }}</td>
        <td class="text-xs-center hidden-md-and-down pr-0">{{ props.item.date | formatDate }}</td>
        <td class="text-xs-center hidden-md-and-down pr-2">
          <v-icon v-if="props.item.showicon" small>videocam</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import filters from "@/api/filters.js";
import { mapGetters } from "vuex";

export default {
  props: {
    game: {
      type: Object,
      required: true
    },
    category: {
      type: Object,
      required: true
    },
    runs: {
      type: Array,
      required: true,
      default: () => []
    },
    players: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data() {
    return {
      selected: []
    };
  },

  computed: {
    ...mapGetters({
      timingMethodsNames: "timingMethodsNames"
    }),

    headers() {
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
        value: "mobile_time"
      };

      const default_timing_h = {
        sortable: false,
        align: "center",
        text: this.timingMethodsNames[this.game.ruleset["default-time"]],
        value: this.game.ruleset["default-time"]
      };

      const others_timing_h = this.game.ruleset["run-times"]
        .filter(timingMethod => {
          return timingMethod !== this.game.ruleset["default-time"];
        })
        .map(t => {
          return {
            sortable: false,
            align: "center",
            text: this.timingMethodsNames[t],
            value: t
          };
        });

      // Getting all the variables that aren't sub categories
      const variables_h = this.game.variables.data
        .filter(variable => {
          return (
            variable.category === this.category.id &&
            !variable["is-subcategory"]
          );
        })
        .map(v => {
          return {
            sortable: false,
            align: "center",
            text: v.name,
            value: v.id
          };
        });

      const date_h = {
        sortable: false,
        align: "center",
        text: "Date",
        value: "date"
      };

      let headers = [rank_h, player_h];

      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
        case "md":
          headers = [...headers, mobile_timing_h];
          break;
        case "lg":
        case "xl":
        default:
          headers = [
            ...headers,
            default_timing_h,
            ...others_timing_h,
            ...variables_h,
            date_h
          ];
          break;
      }

      return headers;
    },

    formattedRuns() {
      const formattedruns = this.runs.map(run => {
        // Player's rank
        const place = run.place;

        // Rank's trophy
        const trophy_name = `trophy-${this.o(place)}`;
        const trophy =
          this.game.assets[trophy_name] !== undefined &&
          this.game.assets[trophy_name] !== null
            ? this.game.assets[trophy_name].uri
            : false;

        // Run's date
        const date = run.run.date;

        // Player(s)
        const players = run.run.players.map(player => {
          /**
           * Name and flag
           */
          let name = "";
          let country = false;
          let nameStyle = false;
          let weblink = false;

          if (player.hasOwnProperty("id")) {
            const fullPlayerObject = this.players.find(p => p.id === player.id);
            name = fullPlayerObject.names.international;

            if (fullPlayerObject.location !== null) {
              country = fullPlayerObject.location.country;
              country.code = fullPlayerObject.location.country.code.split(
                "/"
              )[0];
            }

            nameStyle = this.formatNameStyle(fullPlayerObject["name-style"]);

            weblink = fullPlayerObject.weblink;
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
        const defaultTimeName = this.game.ruleset["default-time"];

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
          : run.run.times[`${this.game.ruleset["default-time"]}_t`];

        // Other timing methods' names, if any
        const othersTimeNames = this.game.ruleset["run-times"].filter(
          timingMethod => {
            return timingMethod !== this.game.ruleset["default-time"];
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
        const variables = this.game.variables.data.filter(variable => {
          return (
            variable.category === this.category.id &&
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
        const outputRun = {
          place,
          trophy,
          players,
          default_t,
          primary_t,
          other_t,
          values,
          date,
          showicon,
          run
        };

        return outputRun;
      });

      return formattedruns;
    }
  },

  methods: {
    o: value => filters.ordinal(value),

    onRunClick(run) {
      const players = run.run.players.map(player => {
        return player.id === undefined
          ? player
          : this.players.find(p => p.id === player.id);
      });

      run.run.players = players;
      this.$emit("onRunClick", run);
    },

    onPlayerClick(player) {
      this.$emit("onPlayerClick", player);
    },

    formatNameStyle(namestyle) {
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
  }
};
</script>

<style scoped>
.username {
  color: #e0e0e0;
}

.run-row {
  cursor: pointer;
}
</style>


