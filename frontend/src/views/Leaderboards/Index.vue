<template>
  <v-container>
    <breadcrumbs class="px-0 mx-1"/>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  name: "LeaderboardsIndex",

  components: {
    Breadcrumbs
  }
};
</script>
