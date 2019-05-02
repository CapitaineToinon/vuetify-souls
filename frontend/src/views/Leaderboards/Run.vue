<template>
  <v-layout v-if="isLoaded" wrap>
    <v-flex xs12>
      <v-card class="run-card">
        <div v-for="(link, i) in videos" :key="i" class="video">
          <run-video :url="link.uri"></run-video>
        </div>
        <v-card-title>
          <div>
            <span class="headline font-weight-bold">
              {{ category.name }} {{ runTime }} by
              <player-name v-for="(player, index) in players" :key="index" :player="player"></player-name>
            </span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="primary" :href="data.weblink" target="_blank">watch on speedrun.com</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12 text-xs-center>
      <loader/>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "@/api/speedruncom.js";
import RunVideo from "@/components/RunVideo";
import filters from "@/api/filters.js";
import { mapActions } from "vuex";
import PlayerName from "@/components/PlayerName";

export default {
  components: {
    RunVideo,
    PlayerName
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
    runTime() {
      return filters.formatTime(this.data.times.primary_t);
    },
    players() {
      return this.data.players;
    },
    videos() {
      return this.data.videos.links;
    },
    title() {
      const playerNames = this.players
        .map(player =>
          player.rel === "user" ? player.names.international : player.name
        )
        .join(", ");

      return `${this.category.name} ${this.runTime} by ${playerNames}`;
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

        window.document.title = `SpeedSouls - ${this.title}`;
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
