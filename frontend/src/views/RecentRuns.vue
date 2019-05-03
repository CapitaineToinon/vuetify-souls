<template>
  <v-container>
    <v-layout wrap>
      <recent-runs :runs="runs" @onRunClick="onRunClick"></recent-runs>
    </v-layout>
  </v-container>
</template>

<script>
import api from "@/api/speedruncom.js";
import { mapGetters, mapActions } from "vuex";
import RecentRuns from "@/components/RecentRuns";

export default {
  components: {
    RecentRuns,
  },

  data() {
    return {
      runs: []
    };
  },

  computed: {
    ...mapGetters({
      getGameById: "speedruncom/getGameById"
    })
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    }),

    onRunClick(run) {
      const game = this.getGameById(run.game);

      /**
       * Update breadcrumbs
       */
      this.setBreadcrumbs(
        this.$breadcrumbs("run", {
          game,
          run: "..."
        })
      );

      this.$router.push({
        name: "run",
        params: {
          abbreviation: game.abbreviation,
          id: run.id
        }
      });
    }
  },

  mounted() {
    api.getRecentRuns().then(runs => {
      this.runs = runs;
      console.log(runs);
    });
  }
};
</script>

