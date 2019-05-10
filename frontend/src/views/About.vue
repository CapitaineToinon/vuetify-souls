<template>
  <v-container fluid class="pa-0">
    <v-layout wrap class>
      <v-flex xs12>
        <v-card v-bind:style="[cardStyle]" class="py-5">
          <v-flex xs12 class="mb-3 px-5">
            <v-img :src="mainLogo" height="90px" contain></v-img>
          </v-flex>
          <v-flex xs12>
            <v-container>
              <v-layout wrap>
                <v-flex xs12 md6 lg3 class="px-2" v-for="(social, index) in socials" :key="index">
                  <v-btn
                    block
                    large
                    :color="social.color"
                    class="white--text"
                    :href="social.href"
                    target="_blank"
                  >
                    {{ social.text }}
                    <v-icon right dark>{{ social.icon }}</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-toolbar>
                <v-toolbar-title>Readme</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card class="pa-4">
                <div v-if="content" v-html="compiledMarkdown"></div>
                <loader v-else/>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import marked from "marked";
import colors from "vuetify/es5/util/colors";

import { mapGetters } from "vuex";
const GITHUB = "https://api.github.com";

export default {
  name: "about",

  data() {
    return {
      content: null,
      socials: [
        {
          text: "Discord",
          icon: "fab fa-discord",
          color: "#7289da",
          href: process.env.VUE_APP_DISCORD
        },
        {
          text: "Twitter",
          icon: "fab fa-twitter",
          color: "#1da1f2",
          href: process.env.VUE_APP_TWITTER
        },
        {
          text: "Twitch",
          icon: "fab fa-twitch",
          color: "#6441a4",
          href: process.env.VUE_APP_TWITCH
        },
        {
          text: "Github",
          icon: "fab fa-github",
          color: colors.grey.darken3,
          href: process.env.VUE_APP_GITHUB
        }
      ],
      team: [
        // todo
      ]
    };
  },

  mounted() {
    axios
      .get(`${GITHUB}/repos/CapitaineToinon/SpeedSouls/readme`)
      .then(response => {
        this.content = response.data.content;
      });
  },

  computed: {
    ...mapGetters({
      dark: "darktheme"
    }),

    cardStyle() {
      return this.dark
        ? {
            backgroundColor: colors.grey.darken4
          }
        : {
            backgroundColor: colors.grey.lighten4
          };
    },

    mounted() {
      return this.content !== null;
    },

    mainLogo() {
      return this.dark
        ? require("@/assets/main-logo-white.png")
        : require("@/assets/main-logo-black.png");
    },

    compiledMarkdown() {
      return marked(window.atob(this.content), { sanitize: true });
    }
  }
};
</script>