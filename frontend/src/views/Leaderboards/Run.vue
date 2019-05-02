<template>
  <v-layout v-if="isLoaded" wrap>
    <v-flex xs12>
      <v-card class="run-card">
        <div v-for="(link, i) in videos" :key="i" class="video">
          <run-video :url="link.uri"></run-video>
        </div>
        <v-card-title>
          <div>
            <span class="headline font-weight-bold">{{ title }}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="primary" :href="data.weblink" target="_blank">View on Speedrun.com</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12 text-xs-center>
      <v-progress-circular class="ma-5" indeterminate color="primary"></v-progress-circular>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "@/api/speedruncom.js";
import RunVideo from "@/components/RunVideo";
import filters from "@/api/filters.js";
import { mapActions } from "vuex";

export default {
  components: {
    RunVideo
  },

  data() {
    return {
      data: null
    };
  },

  computed: {
    isLoaded() {
      return this.data !== null;
    },
    game() {
      return this.data.game;
    },
    category() {
      return this.data.category;
    },
    players() {
      return this.data.players.data;
    },
    videos() {
      return this.data.videos.links;
    },
    title() {
      const categoryName = this.category.name;
      const runTime = filters.formatTime(this.data.times.primary_t);
      const playerNames = this.players
        .map(player =>
          player.rel === "user" ? player.names.international : player.name
        )
        .join(", ");

      return `${categoryName} ${runTime} by ${playerNames}`;
    }
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    })
  },

  mounted() {
    api
      .getRun(this.$route.params.id)
      .then(data => {
        this.data = data;

        /**
         * Update breadcrumbs
         */
        this.setBreadcrumbs(
          this.$breadcrumbs("run", {
            game: this.game,
            run: this.title
          })
        );
      })
      .catch(error => {
        this.$router.push({
          name: "leaderboard",
          params: {
            abbreviation: this.$route.params.abbreviation
          }
        });
      });
  }
};
</script>

<style>
iframe {
  width: 100%;
}
</style>
