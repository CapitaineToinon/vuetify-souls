<template>
  <v-layout wrap v-if="mounted">
    <v-flex xs12 md3>
      <CategoriesListing
        :categories="game.categories.data"
        :selected="selectedCategory"
        @onCategoryChange="changeCategory"
        class="mb-2 mx-1"
      ></CategoriesListing>
    </v-flex>

    <v-flex xs12 md9>
      <v-layout row wrap>
        <v-flex v-if="subCategories !== null" xs12>
          <v-btn-toggle
            v-model="subc.value"
            v-for="subc in subCategories"
            :key="subc.id"
            mandatory
            @change="onSubCategoryChange"
            class="mb-2 mx-1"
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

        <v-flex v-if="error" xs12>
          <v-alert :value="true" type="error">The leaderboards could not be loaded.</v-alert>
          <v-btn @click="updateLeaderboard" color="error">Try again</v-btn>
        </v-flex>
        <v-flex v-else-if="leaderboard !== null" xs12>
          <leaderboard
            :headers="leaderboard.headers"
            :runs="leaderboard.runs"
            @onRunClick="onRunClick"
            class="mx-1"
          ></leaderboard>
        </v-flex>
        <v-flex v-else xs12 text-xs-center>
          <loader/>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "../../api/speedruncom.js";
import CategoriesListing from "../../components/CategoriesListing";
import Leaderboard from "../../components/Leaderboard";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CategoriesListing,
    Leaderboard
  },

  data() {
    return {
      error: false,
      game: null,
      category: null,
      subCategories: null,
      leaderboard: null
    };
  },

  watch: {
    game(newGame, oldGame) {
      // eslint-disable-line
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
      // eslint-disable-line
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
    selectedCategory() {
      let selected = null;

      if (this.mounted && this.category) {
        selected = this.game.categories.data.findIndex(
          category => category.id === this.category.id
        );
      }

      return selected;
    },

    mounted() {
      return this.game !== null;
    },

    ...mapGetters({
      games: "speedruncom/games",
      getGameByAbbreviation: "speedruncom/getGameByAbbreviation"
    })
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    }),

    changeCategory(category) {
      /**
       * This will trigger the category watcher, eventually
       * updating the leaderboards
       */
      this.updateHash(category);
      this.category = category;
    },

    onRunClick(run) {
      /**
       * Update breadcrumbs
       */
      this.setBreadcrumbs(
        this.$breadcrumbs("run", {
          game: this.game,
          run: "..."
        })
      );

      this.$router.push({
        name: "run",
        params: {
          abbreviation: this.game.abbreviation,
          id: run.run.id
        }
      });
    },

    onSubCategoryChange() {
      this.updateLeaderboard();
    },

    getCategoryFromHash() {
      return this.game.categories.data.find(category => {
        const split = category.weblink.split("#");
        return window.location.hash === `#${split[1]}`;
      });
    },

    updateHash(category) {
      const split = category.weblink.split("#");
      window.location.replace("#" + split[1]);
    },

    updateLeaderboard() {
      this.error = false;
      this.leaderboard = null;

      const gameid = this.game.id;
      const categoryid = this.category.id;

      api
        .getLeaderboard(this.game.id, this.category.id, this.subCategories)
        .then(data => {
          /**
           * Only updates the leaderboards if
           * game, category and didn't change
           * since the start of the request
           */
          if (gameid === this.game.id && categoryid === this.category.id) {
            this.leaderboard = {
              headers: data.headers,
              runs: data.runs
            };
          }
        })
        .catch(error => {
          this.error = true;
        });
    }
  },

  activated() {
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

    /**
     * Update breadcrumbs
     */
    this.setBreadcrumbs(
      this.$breadcrumbs("leaderboard", {
        game: this.game,
        run: null
      })
    );

    window.document.title = `SpeedSouls - ${
      this.game.names.international
    } Leaderboards`;
  }
};
</script>

