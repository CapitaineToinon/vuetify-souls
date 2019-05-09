<template>
  <v-container fluid class="pa-0">
    <v-layout>
      <v-flex xs12>
        <v-carousel>
          <v-carousel-item :src="games[0].assets.background.uri">
            <v-container fill-height class="pa-5">
              <v-layout align-space-between justify-center column fill-height>
                <div>
                  <v-layout row wrap>
                    <v-flex xs12 class="mb-2">
                      <v-img :src="mainLogo" height="90px" contain></v-img>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="red" large block>Leaderboards</v-btn>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="primary" large block>Wiki</v-btn>
                    </v-flex>
                    <v-flex xs12 sm4 class="px-2">
                      <v-btn color="blue" large block>Submit</v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </v-layout>
            </v-container>
          </v-carousel-item>

          <!-- TODO players -->
          <!-- <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">connard</v-carousel-item> -->
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import colors from "vuetify/es5/util/colors";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      dark: "darktheme",
      games: "speedruncom/games"
    }),

    mainLogo() {
      return this.dark
        ? require("@/assets/main-logo-white.png")
        : require("@/assets/main-logo-black.png");
    }
  }
};
</script>