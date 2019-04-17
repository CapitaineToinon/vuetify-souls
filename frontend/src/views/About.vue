<template>
  <v-container fluid>
    <v-layout column>
      <v-flex xs12 class="text-xs-center" mt-5>
        <div v-html="compiledMarkdown"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import marked from "marked";
const GITHUB = "https://api.github.com";

export default {
  data() {
    return {
      content: "",
    }
  },
  mounted() {
    axios.get(`${GITHUB}/repos/CapitaineToinon/SpeedSouls/readme`).then(response => {
      this.content = response.data.content;
    })
  },
  computed: {
    compiledMarkdown() {
      return marked(window.atob(this.content), { sanitize: true })
    }
  }
};
</script>