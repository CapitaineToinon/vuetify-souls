<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2} game-card`"
      @click="onGameClick()"
    >
      <v-img
        v-if="game.assets.background !== null"
        :src="background"
        class="game-image"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
        :aspect-ratio="16/9"
      >
        <v-container fill-height fluid>
          <v-layout align-center text-xs-center fill-height>
            <v-flex xs12 align-end flexbox class="ml-4 mr-4">
              <span class="font-weight-bold headline white--text">{{ game.names.international }}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props : {
    game: {
      type: Object,
      required: true,
    }
  },

  computed: {
    background() {
      return `${process.env.VUE_APP_API_BASE_URL}/background/${this.game.id}`;
    }
  },

  methods: {
    onGameClick() {
      this.$emit("onGameClick");
    }
  }
};
</script>

