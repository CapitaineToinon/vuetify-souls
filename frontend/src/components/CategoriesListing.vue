<template>
  <v-card>
    <v-toolbar color="primary">
      <v-toolbar-title >Categories</v-toolbar-title>
    </v-toolbar>

    <v-list one-line>
      <template v-for="(item, index) in perGameCategories">
        <v-list-tile :key="index" avatar @click="onCategoryClick(item)">
          <v-list-tile-content :key="item.id">
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },

  computed: {
    perGameCategories() {
      return this.categories.filter(m => m.type === "per-game");
    }
  },

  methods: {
    onCategoryClick(category) {
      this.$emit("onCategoryClick", category);
    }
  },
};
</script>

