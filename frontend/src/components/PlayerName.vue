<template>
  <span>
    <v-tooltip v-if="player.country" bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on" :class="`flag-icon flag-icon-${player.country.code}`"></span>
      </template>
      <span>{{ player.country.names.international }}</span>
    </v-tooltip>
    <span
      v-if="player.weblink"
      @click.stop="onClick()"
      target="_blank"
      class="username ml-1"
      :data-text="player.name"
      v-bind:style="[styles]"
    >{{ player.name }}</span>
    <span v-else>{{ player.name }}</span>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      dark: "darktheme"
    }),

    styles() {
      let style = null;
      const theme = this.dark || true ? "dark" : "light";
      const namestyle = this.player.nameStyle;

      switch (namestyle.style) {
        case "gradient":
          style = {
            background: `-webkit-linear-gradient(0deg, ${
              namestyle["color-from"][theme]
            }, ${namestyle["color-to"][theme]})`,
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent"
          };
          break;
        case "solid":
          style = {
            background: `-webkit-linear-gradient(0deg, ${
              namestyle["color"][theme]
            }, ${namestyle["color"][theme]})`,
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent"
          };
          break;
        default:
          style = {};
          break;
      }

      return style;
    }
  },

  methods: {
    onClick() {
      window.open(this.player.weblink);
    }
  }
};
</script>

<style scoped>
.username {
  position: relative;
  z-index: 1;
  font-weight: bold;
}

.username::after {
  background: none;
  content: attr(data-text);
  left: 0;
  position: absolute;
  text-shadow: 0px -1px #000, 1px -1px #000, 1px 0px #000, 1px 1px #000,
    0px 1px #000, -1px 1px #000, -1px 0px #000, -1px -1px #000 !important;
  z-index: -1;
  font-weight: bold;
}
</style>

