<template>
  <v-layout wrap>
    <v-flex v-for="game in games" :key="game.id" class="pa-1" xs12 sm6 md4 grow>
      <game-card :game="game" @onGameClick="openLeaderboards(game.abbreviation)"></game-card>
    </v-flex>
  </v-layout>
</template>

<script>
import GameCard from "@/components/GameCard";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GameList",

  components: {
    GameCard
  },

  computed: {
    ...mapGetters({
      games: "speedruncom/games"
    }),

    suffledGames() {
      return [...this.games].sort(function() {
        return 0.5 - Math.random();
      });
    }
  },

  methods: {
    ...mapActions({
      setBreadcrumbs: "breadcrumbs/setBreadcrumbs"
    }),

    openLeaderboards(abbreviation) {
      this.$router.push({
        name: "leaderboard",
        params: {
          abbreviation: abbreviation
        }
      });
    }
  },

  activated() {
    /**
     * Update breadcrumbs
     */
    this.setBreadcrumbs(this.$breadcrumbs("gamelist"));

    window.document.title = `SpeedSouls - Souls Games`;
  }
};
</script>

<style scoped>
.game-card {
  cursor: pointer;
}

.repeating-gradient {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 0, 0, 0.25),
    rgba(255, 0, 0, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 5px,
    rgba(0, 0, 255, 0.25) 10px
  );
}
</style>


