<template>
  <v-container>
    <v-layout wrap v-if="!redirecting">
      <v-flex xs12>
        <v-alert :value="true" type="info">Page not found. You are being redirected to {{ to }}</v-alert>
      </v-flex>
      <v-flex xs12>
        <template>
          <v-progress-linear v-model="progress"></v-progress-linear>
        </template>
      </v-flex>
      <v-flex xs12>TOTO: Warn the user about the new wiki sub domain.</v-flex>
      <v-flex text-xs-center xs12 class="pa-5">
        <v-btn color="success" @click="redirect">Redirect now</v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-else text-xs-center wrap>
      <v-flex xs12>
        <a :href="to">Click here if you are not being redirected automatically.</a>
      </v-flex>
      <v-flex xs12>
        <loader class="ma-5"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { setInterval, clearInterval } from "timers";
const COUNTDOWN_DURATION = 10;

export default {
  data() {
    return {
      progress: 100,
      countdown: COUNTDOWN_DURATION,
      timer: null
    };
  },

  computed: {
    redirecting() {
      return this.countdown < 0;
    },
    to() {
      return `${process.env.VUE_APP_WIKI_URL}${this.$route.fullPath}`;
    }
  },

  watch: {
    $route() {
      this.countdown = COUNTDOWN_DURATION;
    },

    countdown() {
      this.progress = (this.countdown * 100) / COUNTDOWN_DURATION;
    }
  },

  methods: {
    redirect() {
      this.countdown = -1;
      this.clear();
      window.location.replace(this.to);
    },
    clear() {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  mounted() {
    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown < 0) {
        this.redirect();
      }
    }, 1000);
  },

  beforeDestroy() {
    this.clear();
  }
};
</script>

