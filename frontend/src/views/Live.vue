<template>
  <v-container>
    <v-layout wrap>
      <v-flex v-for="stream in streams" :key="stream._id" class="pa-1" xs12 sm6 md4 grow>
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2} stream-card`"
            @click="openStream(stream)"
          >
            <v-img
              :src="stream.preview.large"
              height="200px"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
            >
              <v-container fill-height fluid>
                <v-layout align-center text-xs-center fill-height>
                  <v-flex xs12 align-end flexbox class="ml-4 mr-4">
                    <span class="font-weight-bold headline">{{ stream.channel.display_name }}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters({
    streams: "twitch/streams"
  }),
  methods: {
    openStream(stream) {
      window.open(stream.channel.url);
    }
  }
};
</script>

<style scoped>
.stream-card {
  cursor: pointer;
}

.repeating-gradient {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 0, 0, 0.25),
    rgba(255, 0, 0, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 10px
  );
}
</style>
