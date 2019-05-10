<template>
  <v-container fluid class="pa-0">
    <v-layout wrap>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item
            :src="randomBackground"
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          >
            <v-container fill-height class="pa-5">
              <v-layout align-space-between justify-center column fill-height>
                <div>
                  <v-layout row wrap>
                    <v-flex xs12 class="mb-2">
                      <v-img :src="mainLogo" height="90px" contain></v-img>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="red" large block>Leaderboards</v-btn>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="primary" large block>Wiki</v-btn>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="blue" large block>Submit</v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </v-layout>
            </v-container>
          </v-carousel-item>

          <carousel-run
            v-for="(run, i) in carouselRuns"
            :key="i"
            :run="run"
            @onRunClick="onRunClick"
          />
        </v-carousel>
      </v-flex>
      <v-flex xs12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <recent-runs :runs="runs" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from "@/api/speedruncom.js";
import colors from "vuetify/es5/util/colors";
import { mapGetters, mapActions } from "vuex";

const CAROUSEL_RUNS = 6;

export default {
  name: "homepage",

  components: {
    CarouselRun: () => import("@/components/CarouselRun"),
    RecentRuns: () => import("@/components/RecentRuns"),
  },

  data() {
    return {
      runs: []
    };
  },

  computed: {
    ...mapGetters({
      dark: "darktheme",
      games: "speedruncom/games",
      mounted: "speedruncom/mounted"
    }),

    randomBackground() {
      if (this.mounted) {
        const index = Math.floor(Math.random() * Math.floor(this.games.length));
        return this.games[index].assets.background.uri;
      }
    },

    carouselRuns() {
      return this.runs.length < CAROUSEL_RUNS
        ? this.runs
        : this.runs.slice(0, CAROUSEL_RUNS);
    },

    mainLogo() {
      return this.dark
        ? require("@/assets/main-logo-white.png")
        : require("@/assets/main-logo-black.png");
    }
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    }),

    onRunClick(run) {
      const game = run.game.data;
      /**
       * Update breadcrumbs
       */
      this.setBreadcrumbs(
        this.$breadcrumbs("run", {
          game,
          run: "..."
        })
      );

      this.$router.push({
        name: "run",
        params: {
          abbreviation: game.abbreviation,
          id: run.id
        }
      });
    }
  },

  mounted() {
    api.getRecentRuns().then(runs => {
      this.runs = runs;
      console.log(this.carouselRuns);
    });
  }
};
</script>