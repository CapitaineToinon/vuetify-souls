<template>
  <v-container>
    <v-layout v-if="!isLoading" wrap>
      <v-flex v-for="stream in suffledStreams" :key="stream._id" class="pa-1" xs12 sm6 md4 grow>
        <live-runner :stream="stream"></live-runner>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12 text-xs-center>
        <v-progress-circular class="ma-5" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import LiveRunner from "../components/LiveRunner";

export default {
  components: {
    LiveRunner
  },

  computed: {
    ...mapGetters({
      isLoading: "twitch/isLoading",
      streams: "twitch/streams"
    }),
    suffledStreams() {
      return [...this.streams].sort(() => 0.5 - Math.random());
    }
  }
};
</script>
