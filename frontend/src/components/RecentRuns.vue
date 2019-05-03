<template>
  <v-data-table hide-headers :items="runs" class="elevation-1" hide-actions>
    <template v-slot:items="props">
      <tr :active="props.selected" @click="onRunClick(props.item)" class="run-row">
        <td>{{ props.item.id }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    runs: {
      type: Array,
      default: [],
    }
  },

  methods: {
    onRunClick(run) {
      this.$emit("onRunClick", run);
    }
  },
}
</script>

<style scoped>
.run-row {
  cursor: pointer;
}
</style>
