<template>
  <div v-if="finalBreadcrumbs.length > 1">
    <v-breadcrumbs :items="finalBreadcrumbs">
      <template v-slot:item="props">
        <span v-if="props.item.last">{{ props.item.text }}</span>
        <router-link v-else :to="props.item.to">{{ props.item.text }}</router-link>
      </template>
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      breadcrumbs: "breadcrumbs/breadcrumbs"
    }),
    finalBreadcrumbs() {
      return this.breadcrumbs.map((bc, index) => {
        return {
          ...bc,
          last: index === this.breadcrumbs.length - 1
        }
      })
    }
  }
};
</script>