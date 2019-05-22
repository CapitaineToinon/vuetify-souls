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
          <div class="stream-image-wrapper">
            <v-img
              :src="thumbnail_url"
              :lazy-src="thumbnail_url_lazy"
              class="stream-image"
              gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
              :aspect-ratio="16/9"
            >
              <v-container fill-height fluid>
                <v-layout align-center text-xs-center fill-height>
                  <v-flex xs12 align-end flexbox class="ml-4 mr-4">
                    <span
                      class="font-weight-bold headline white--text"
                    >{{ stream.user.display_name }}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </div>

          <v-card-actions>
            <v-list-tile class="text-truncate">
              <v-list-tile-avatar color="grey darken-3">
                <v-img class="elevation-6" :src="stream.user.profile_image_url"></v-img>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <div class="text-truncate">{{ stream.title }}</div>
                </v-list-tile-title>
                <span class="grey--text text-truncate">{{ stream.game.name }}</span>
              </v-list-tile-content>
            </v-list-tile>
          </v-card-actions>
        </v-card>
      </v-hover>
    </template>
    <span>{{ stream.title }}</span>
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
      window.open(`https://www.twitch.tv/${stream.user.login}`);
    }
  },

  computed: {
    thumbnail_url() {
      return this.stream.thumbnail_url
        .replace("{width}", 640)
        .replace("{height}", 360);
    },
    thumbnail_url_lazy() {
      return this.stream.thumbnail_url
        .replace("{width}", 32)
        .replace("{height}", 18);
    }
  }
};
</script>

<style scoped>
.stream-card {
  cursor: pointer;
}
</style>
