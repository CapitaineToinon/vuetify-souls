<template>
  <v-container>
    <breadcrumbs/>
    <router-view></router-view>
  </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"

export default {
  components: {
    Breadcrumbs
  }
}
</script>
