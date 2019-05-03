<template>
  <v-data-table hide-headers :items="runs" class="elevation-1" hide-actions>
    <template v-slot:items="props">
      <tr :active="props.selected" @click="onRunClick(props.item)" class="run-row">
        <td class="text-xs-center">{{ props.item.game.data.names.international }}</td>
        <td class="text-xs-center">{{ props.item.category.data.name }}</td>
        <td class="text-xs-center">
          <player-name v-for="(player, index) in props.item.players" :key="index" :player="player"></player-name>
        </td>
        <td class="text-xs-center">{{ props.item.times.primary_t | formatTime }}</td>
        <td class="text-xs-center">{{ props.item.status["verify-date"] | formatDate }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import PlayerName from "@/components/PlayerName";

export default {
  components: {
    PlayerName
  },

  props: {
    runs: {
      type: Array,
      default: []
    }
  },

  methods: {
    onRunClick(run) {
      this.$emit("onRunClick", run);
    }
  }
};
</script>

<style scoped>
.run-row {
  cursor: pointer;
}
</style>
