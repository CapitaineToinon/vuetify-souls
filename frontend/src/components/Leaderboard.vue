<template>
  <v-data-table :headers="headers" :items="runs" class="elevation-1" hide-actions>
    <template v-slot:items="props">
      <tr :active="props.selected" @click="onRunClick(props.item.run)" class="run-row">
        <td class="text-xs-center">
          <v-layout justify-center align-center>
            <span
              v-if="props.item.trophy"
              v-bind:style="[{
                backgroundImage: `url(${props.item.trophy})`,
                backgroundPosition: `left center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `16px 16px`,
                paddingLeft: `20px`,
              }]"
              class="trophy-icon"
            >{{ props.item.place }}</span>
            <span v-else>{{ props.item.place }}</span>
          </v-layout>
        </td>
        <td class="text-xs-center">
          <div v-for="(player, i) in props.item.players" :key="`player-${i}`">
            <player-name :player="player"></player-name>
          </div>
        </td>
        <td class="text-xs-center hidden-lg-and-up">{{ props.item.primary_t | formatTime }}</td>
        <td class="text-xs-center hidden-md-and-down">{{ props.item.default_t | formatTime }}</td>
        <td
          v-for="(time, i) in props.item.other_t"
          :key="`time-${i}`"
          class="text-xs-center hidden-md-and-down"
        >{{ time | formatTime }}</td>
        <td
          v-for="(val, i) in props.item.values"
          :key="`var-${i}`"
          class="text-xs-center hidden-md-and-down"
        >{{ val }}</td>
        <td class="text-xs-center hidden-md-and-down pr-0">{{ props.item.date | formatDate }}</td>
        <td class="text-xs-center hidden-md-and-down pr-2">
          <v-icon v-if="props.item.showicon" small>videocam</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";
import PlayerName from "@/components/PlayerName";

export default {
  components: {
    PlayerName,
  },

  props: {
    headers: {
      type: Array,
      required: true,
    },
    runs: {
      type: Array,
      required: true,
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


