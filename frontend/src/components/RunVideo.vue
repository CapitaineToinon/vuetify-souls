<template>
  <youtube v-if="isYouTube" :video-id="getYoutubeId()"></youtube>
  <vue-twitch-player v-else-if="isTwitch" :video="getTwitchId()"></vue-twitch-player>
  <div v-else>{{ url }}</div>
</template>

<script>
// https://github.com/streamlink/streamlink/blob/master/src/streamlink/plugins/twitch.py
/* eslint-disable-next-line */
const TWITCH_REGEX = /http(?:s)?:\/\/(?:(?::?[\w\-]+)\.)?twitch.tv\/(?:videos\/(:?\d+)|(?::?[^/]+))(?:\/(?::?[bcv])(?:ideo)?\/(?::?\d+))?(?:\/(?::?[\w]+))?/;
import VueTwitchPlayer from "vue-twitch-player";

export default {
  components: {
    VueTwitchPlayer
  },

  props: {
    url: {
      type: String,
      required: true
    }
  },

  computed: {
    isYouTube() {
      return this.getYoutubeId() !== null;
    },
    isTwitch() {
      return this.getTwitchId() !== null;
    }
  },

  methods: {
    getYoutubeId() {
      return this.$youtube.getIdFromUrl(this.url);
    },
    getTwitchId() {
      const matches = this.url.match(TWITCH_REGEX);
      return matches ? matches[1] : null;
    }
  },

  mounted() {}
};
</script>
