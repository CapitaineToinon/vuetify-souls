<template>
  <span>
    <v-tooltip v-if="player.country" bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on" :class="`flag-icon flag-icon-${player.country.code}`"></span>
      </template>
      <span>{{ player.country.names.international }}</span>
    </v-tooltip>
    <span
      v-if="player.weblink"
      @click.stop="onClick()"
      target="_blank"
      class="font-weight-bold username ml-1"
      v-bind:style="[player.nameStyle]"
    >{{ player.name }}</span>
    <span v-else>{{ player.name }}</span>
  </span>
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },

  methods: {
    onClick() {
      window.open(this.player.weblink);
    }
  }
};
</script>

<style scoped>
.username {
  cursor: pointer;
}
</style>

