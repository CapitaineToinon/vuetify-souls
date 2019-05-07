<template>
  <v-container>
    <div v-if="!error">
      <div v-if="!isLoading">
        <v-layout wrap>
          <v-layout v-if="suffledStreams.length < 1">
            <v-flex xs12>
              <v-alert :value="true" type="info">Seems like no-one is streaming.</v-alert>
            </v-flex>
          </v-layout>
          <v-flex v-for="stream in suffledStreams" :key="stream._id" class="pa-1" xs12 sm6 md4 grow>
            <live-runner :stream="stream"></live-runner>
          </v-flex>
        </v-layout>
      </div>
      <v-layout v-else>
        <v-flex xs12 text-xs-center>
          <loader/>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
      <v-layout wrap>
        <v-flex xs12>
          <v-alert :value="true" type="error">Error loading the streams.</v-alert>
        </v-flex>
      </v-layout>
    </div>
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
      streams: "twitch/streams",
      error: "twitch/error"
    }),

    suffledStreams() {
      return [...this.streams].sort(() => 0.5 - Math.random());
    }
  }
};
</script>
