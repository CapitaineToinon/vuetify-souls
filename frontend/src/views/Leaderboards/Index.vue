<template>
  <v-container>
    <breadcrumbs class="px-0 mx-1"/>
    <keep-alive :include="cachedRoutes">
      <router-view></router-view>
    </keep-alive>
  </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  name: "LeaderboardsIndex",

  data() {
    return {
      /**
       * Todo caching routes
       * Causing problems right now with nested router-view
       */
      cachedRoutes: [],
    }
  },

  components: {
    Breadcrumbs
  }
};
</script>
