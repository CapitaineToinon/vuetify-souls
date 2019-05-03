<template>
  <div v-if="isYouTube" class="speedsouls-video">
    <youtube :video-id="getYoutubeId()"></youtube>
  </div>
  <div v-else-if="isTwitch" class="speedsouls-video">
    <vue-twitch-player :video="getTwitchId()"></vue-twitch-player>
  </div>
  <div v-else class="speedsouls-video-link pa-3 text-xs-center">
    <a :href="url" target="_blank">{{ url }}</a>
  </div>
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

<style>
/**
 * Scoped CSS Doesn't work on dynamic content 
 * https://github.com/vuejs/vue-loader/issues/559
 */
.speedsouls-video {
  width: 100%;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.speedsouls-video iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
