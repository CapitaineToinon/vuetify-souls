<template>
  <div>
    <v-select class="hidden-md-and-up" :value="perGameCategories[selected]" :items="perGameCategories" @change="changeCategory">
      <template v-slot:item="props">{{ props.item.name }}</template>
      <template v-slot:selection="props">{{ props.item.name }}</template>
    </v-select>
    <v-card class="hidden-sm-and-down">
      <v-navigation-drawer width="auto">
        <v-toolbar flat>
          <v-list>
            <v-list-tile>
              <v-list-tile-title>Categories</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile
            v-for="(item, index) in perGameCategories"
            :key="index"
            :class="(index === selected) ? `primary` : ``"
            @click="changeCategory(item)"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Number,
      default: () => null
    },
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
    changeCategory(category) {
      this.$emit("onCategoryChange", category);
    }
  }
};
</script>

