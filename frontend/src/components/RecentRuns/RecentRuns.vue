<template>
  <v-data-table :headers="headers" :items="runs" hide-actions>
    <template v-slot:headers="props">
      <tr>
        <th class="px-0">
          <recent-run class="px-2"></recent-run>
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <tr :active="props.selected" class="run-row" @click="onRunClick(props.item)">
        <td class="px-0">
          <recent-run class="px-2" >
            <template v-slot:game>{{ props.item.game.data.names.international }}</template>
            <template v-slot:category>{{ props.item.category.data.name }}</template>
            <template v-slot:player>
              <span v-for="(p, i) in props.item.players" :key="i">
                <player-name :player="p"></player-name>
                {{ (i !== props.item.players.length - 1) ? ', ' : '' }}
              </span>
            </template>

            <template v-slot:time>{{ props.item.times.primary_t | formatTime }}</template>
            <template v-slot:date>{{ props.item.date | formatDate }}</template>
          </recent-run>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import RecentRun from "./RecentRun";
import PlayerName from "@/components/PlayerName";
import { mapActions } from "vuex";

export default {
  name: "recent-runs",

  components: {
    RecentRun,
    PlayerName
  },

  data() {
    return {
      headers: [
        {
          text: "Game",
          sortable: false,
          value: "Game"
        },
        { text: "Category", sortable: false, value: "Category" },
        { text: "Player", sortable: false, value: "Player" },
        { text: "Time", sortable: false, value: "Time" },
        { text: "Date", sortable: false, value: "Date" }
      ]
    };
  },

  props: {
    // headers: ["Game", "Category", "Player", "Time", "Date"],

    runs: {
      type: Array,
      default: []
    }
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
  }
};
</script>

<style scoped>
.run-row {
  cursor: pointer;
}
</style>
