<template>
  <v-container>
    <breadcrumbs class="px-0 mx-1"/>
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
