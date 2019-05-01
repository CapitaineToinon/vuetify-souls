<template>
  <div>
    <h1>{{ $route.params.id }}</h1>
    <pre>{{ run }}</pre>
  </div>
</template>

<script>
import api from "@/api/speedruncom.js";

export default {
  data() {
    return {
      run: {}
    };
  },
  mounted() {
    api
      .getRun(this.$route.params.id)
      .then(data => {
        this.run = data;
      })
      .catch(error => {
        this.$router.push({
          name: "leaderboard",
          params: {
            abbreviation: this.$route.params.abbreviation
          }
        });
      });
  }
};
</script>
