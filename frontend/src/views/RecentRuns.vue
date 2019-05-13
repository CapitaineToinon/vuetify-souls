<template>
  <v-container>
    <recent-runs :runs="runs"></recent-runs>
  </v-container>
</template>

<script>
import api from "@/api/speedruncom.js";
import { mapGetters, mapActions } from "vuex";
import RecentRuns from "@/components/RecentRuns";

export default {
  components: {
    RecentRuns
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
      /**
       * Update breadcrumbs
       */
      this.setBreadcrumbs(
        this.$breadcrumbs("run", {
          game: run.game.data,
          run: "..."
        })
      );

      this.$router.push({
        name: "run",
        params: {
          abbreviation: run.game.data.abbreviation,
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

