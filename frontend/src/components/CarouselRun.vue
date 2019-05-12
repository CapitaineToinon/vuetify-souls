<template>
  <v-carousel-item
    :src="background"
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
    @click="onClick"
    class="carousel-run"
  >
    <v-container fill-height class="pa-5">
      <v-layout align-space-between justify-center column fill-height>
        <div>
          <v-layout row wrap class="text-xs-center white--text">
            <v-flex xs12 class="mb-2">
              <span class="display-1 font-weight-bold">{{ game.names.international }}</span>
            </v-flex>
            <v-flex xs12 class="mb-2">
              <span
                class="display-2 font-weight-bold"
              >{{ category.name }} {{ run.times.primary_t | formatTime }}</span>
            </v-flex>
            <v-flex xs12 class="px-2">
              <span class="headline font-weight-bold">
                by
                <player-name v-for="(player, index) in players" :key="index" :player="player"></player-name>
                {{ run.date | formatDate }}
              </span>
            </v-flex>
          </v-layout>
        </div>
      </v-layout>
    </v-container>
  </v-carousel-item>
</template>

<script>
import PlayerName from "@/components/PlayerName";

export default {
  components: {
    PlayerName
  },

  props: {
    run: {
      type: Object,
      required: true
    }
  },

  computed: {
    game() {
      return this.run.game.data;
    },
    category() {
      return this.run.category.data;
    },
    players() {
      return this.run.players;
    },
    title() {
      const playerNames = this.players.map(player => player.name).join(", ");
      return `${this.category.name} ${this.runTime} by ${playerNames}`;
    },
    background() {
      return `${process.env.VUE_APP_API_BASE_URL}/background/${this.run.game.data.id}`;
    }
  },

  methods: {
    onClick() {
      this.$emit("onRunClick", this.run);
    }
  }
};
</script>

<style scoped>
.carousel-run {
  cursor: pointer;
}
</style>

