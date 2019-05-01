<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-hover>
        <v-card
          v-on="on"
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

          <v-card-actions>
            <v-list-tile class="text-truncate">
              <v-list-tile-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="stream.channel.logo"></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <div class="text-truncate">{{ stream.channel.status }}</div>
                </v-list-tile-title>
                <span class="grey--text text-truncate">{{ stream.game }}</span>
              </v-list-tile-content>
            </v-list-tile>
          </v-card-actions>
        </v-card>
      </v-hover>
    </template>
    <span>{{ stream.channel.status }}</span>
  </v-tooltip>
</template>

<script>
import moment from "moment";

export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  },

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
</style>
