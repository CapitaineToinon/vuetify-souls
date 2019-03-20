<template>
  <v-layout wrap v-if="mounted">
    <v-flex xs12 sm3>
      <CategoriesListing
        :categories="game.categories.data"
        @onCategoryClick="onCategoryClick"
        class="mr-3"
      ></CategoriesListing>
    </v-flex>

    <v-flex xs12 sm9>
      <v-layout row wrap>
        <v-flex v-if="subCategories !== null" xs12>
          <v-btn-toggle
            v-model="subc.value"
            v-for="subc in subCategories"
            :key="subc.id"
            mandatory
            @change="onSubCategoryChange"
            class="mb-3"
          >
            <v-btn
              block
              flat
              :value="j"
              v-for="(value, j) in subc.values"
              :key="j"
            >{{ value.label }}</v-btn>
          </v-btn-toggle>
        </v-flex>

        <v-flex v-if="leaderboard !== null" xs12>
          <leaderboard
            :game="game"
            :category="category"
            :runs="leaderboard.runs"
            :players="leaderboard.players.data"
            @onRunClick="onRunClick"
            @onPlayerClick="onPlayerClick"
          ></leaderboard>
        </v-flex>
        <v-flex v-else xs12 sm9 text-xs-center>
          <v-progress-circular class="ma-5" indeterminate color="red"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "../../api/speedruncom.js";
import CategoriesListing from "../../components/CategoriesListing";
import Leaderboard from "../../components/Leaderboard";
import { mapGetters } from "vuex";

export default {
  components: {
    CategoriesListing,
    Leaderboard
  },

  data() {
    return {
      game: null,
      category: null,
      subCategories: null,
      leaderboard: null
    };
  },

  watch: {
    game(newGame, oldGame) {
      if (this.game.categories.data.length > 0) {
        /**
         * Either get the category from the hash in the url
         * or uses the first one we find
         */
        const category_from_hash = this.getCategoryFromHash();

        /**
         * This will trigger the category watcher, eventually
         * updating the leaderboards
         */
        this.category =
          category_from_hash !== undefined
            ? category_from_hash
            : this.game.categories.data[0];
      }
    },

    category(newCategory, oldCategory) {
      /**
       * Getting the sub categories
       * If variable.category is null then the sub category is global
       * and applies to all categories
       */
      const subcategories = this.game.variables.data.filter(variable => {
        return (
          variable["is-subcategory"] &&
          (variable.category == this.category.id || variable.category === null)
        );
      });

      this.subCategories = subcategories.map(subc => {
        return {
          id: subc.id,
          value: subc.values.default,
          values: subc.values.values
        };
      });

      // Now finally update update the leaderboards
      this.updateLeaderboard();
    }
  },

  computed: {
    mounted() {
      return this.game !== null;
    },

    ...mapGetters({
      games: "speedruncom/games",
      getGameByAbbreviation: "speedruncom/getGameByAbbreviation"
    })
  },

  methods: {
    onCategoryClick(category) {
      /**
       * This will trigger the category watcher, eventually
       * updating the leaderboards
       */
      this.updateHash(category);
      this.category = category;
    },

    onRunClick(run) {
      window.open(run.run.weblink);
    },

    onPlayerClick(player) {
      console.log(player);
      window.open(player.weblink);
    },

    onSubCategoryChange() {
      this.updateLeaderboard();
    },

    getCategoryFromHash() {
      // could return undefined
      return this.game.categories.data.find(category => {
        const split = category.weblink.split("#");
        return window.location.hash === `#${split[1]}`;
      });
    },

    updateHash(category) {
      const split = category.weblink.split("#");
      window.location.hash = split[1];
    },

    updateLeaderboard() {
      this.leaderboard = null;

      const gameid = this.game.id;
      const categoryid = this.category.id;

      api
        .getLeaderboard(this.game.id, this.category.id, this.subCategories)
        .then(leaderboard => {
          /**
           * Only updates the leaderboards if
           * game, category and didn't change
           * since the start of the request
           */
          if (gameid === this.game.id && categoryid === this.category.id) {
            this.leaderboard = leaderboard;
          }
        });
    }
  },

  mounted() {
    const abbreviation = this.$route.params.abbreviation;
    const game = this.getGameByAbbreviation(abbreviation);

    // Game not found, return to the game list page
    if (game === undefined) {
      this.$router.push({
        name: "gamelist"
      });
      return;
    }

    /**
     * This will trigger the game watcher, eventually
     * updating the leaderboards
     */
    this.game = game;
  }
};
</script>

