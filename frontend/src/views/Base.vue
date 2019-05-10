<template>
  <v-container fluid class="pa-0">
    <v-layout wrap>
      <v-flex xs12>
        <keep-alive>
          <v-carousel v-model="selectedCarousel" :height="carouselHeight">
            <v-carousel-item
              :src="randomBackground"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            >
              <v-container fill-height class="pa-5">
                <v-layout align-space-between justify-center column fill-height>
                  <div>
                    <v-layout align-center justify-center row wrap>
                      <v-flex xs12 class="mb-2">
                        <v-img :src="mainLogo" height="90px" contain></v-img>
                      </v-flex>
                      <v-flex xs12 sm4 class="px-2">
                        <v-btn color="red" large block :to="{ name: 'gamelist' }">Leaderboards</v-btn>
                      </v-flex>
                      <v-flex xs12 sm4 class="px-2">
                        <v-btn color="primary" large block @click="openWiki">Wiki</v-btn>
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
        </keep-alive>
      </v-flex>
      <v-flex xs12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <recent-runs @onRunClick="onRunClick" :runs="runs"/>
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
import CarouselRun from "@/components/CarouselRun";
import RecentRuns from "@/components/RecentRuns";
import { mapGetters, mapActions } from "vuex";

const CAROUSEL_RUNS = 6;

export default {
  name: "home",

  components: {
    CarouselRun,
    RecentRuns,
  },

  data() {
    return {
      mainLogo: require("@/assets/main-logo-white.png"),
      carouselHeight: 400,
      selectedCarousel: 0,
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
    }
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    }),

    openWiki() {
      window.open(process.env.VUE_APP_WIKI_URL);
    },

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

  beforeCreate() {
    api.getRecentRuns().then(runs => {
      this.runs = runs.slice(0, 20);
      console.log(this.carouselRuns);
    });
  },
};
</script>