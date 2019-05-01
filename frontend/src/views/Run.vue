<template>
  <div>
    <v-layout v-if="isLoaded" wrap>
      <v-flex xs12>
        <v-card class="mx-1">
          <run-video class="video" v-for="(link, i) in videos" :key="i" :url="link.uri"></run-video>
          <v-card-title>
            <div>
              <span class="grey--text">Number 10</span>
              <br>
              <span>Whitehaven Beach</span>
              <br>
              <span>Whitsunday Island, Whitsunday Islands</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 text-xs-center>
        <v-progress-circular class="ma-5" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import api from "@/api/speedruncom.js";
import RunVideo from "@/components/RunVideo";

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
    player() {
      return this.data.players.data[0];
    },
    videos() {
      return this.data.videos.links;
    }
  },

  mounted() {
    api
      .getRun(this.$route.params.id)
      .then(data => {
        this.data = data.data;
        console.log(this.data);
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
