<template>
  <v-layout wrap>
    <v-flex v-for="game in games" :key="game.id" class="pa-1" xs12 sm6 md4 grow>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 2} game-card`"
          @click="openLeaderboards(game.abbreviation)"
        >
          <v-img
            v-if="game.assets.background !== null"
            :src="game.assets.background.uri"
            height="200px"
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          >
            <v-container fill-height fluid>
              <v-layout align-center text-xs-center fill-height>
                <v-flex xs12 align-end flexbox class="ml-4 mr-4">
                  <span class="font-weight-bold headline">{{ game.names.international }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      reviews: 413,
      value: 4.5
    };
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

  mounted() {
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


