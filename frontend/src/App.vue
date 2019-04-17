<template>
  <v-app dark>

    <v-navigation-drawer v-model="sidebar" width="300" class="hide-lg-and-down" app temporary>
      <v-text-field style="margin: 13px 15px -12px 15px;"
        solo light
        label="Search Speedsouls"
        prepend-inner-icon="search"
      ></v-text-field>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile
          active-class="primary"
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content class="font-weight-bold">{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile
          active-class="primary"
          v-for="item in secondaryItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content class="font-weight-bold">{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>
    </v-navigation-drawer>

    <v-toolbar app>
      <span>
        <v-toolbar-side-icon @click="sidebar = !sidebar" style="margin-right: -5px"></v-toolbar-side-icon>
      </span>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          <div
            class="title font-italic font-weight-bold"
            style="letter-spacing: -1px !important"
          >{{ appTitle }}&nbsp;</div>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          class="text-capitalize font-weight-bold"
          active-class="primary"
          flat
          small
          style="min-width: auto; padding-right: 20px; padding-left: 20px"
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >{{ item.title }}</v-btn>
      </v-toolbar-items>

      <div style="width: 8px"></div>
      <v-divider vertical inset></v-divider>
      <div style="width: 8px"></div>

      <v-toolbar-items class="hidden-xs-and-down">
        <v-btn
          icon
          active-class="primary"
          v-for="item in secondaryItems"
          :key="item.title"
          :to="item.path"
        >
          <v-icon small>{{ item.icon }}</v-icon>
        </v-btn>

        <div style="width: 8px"></div>
        <v-divider vertical inset></v-divider>
        <div style="width: 8px"></div>
      </v-toolbar-items>

      <v-menu
        offset-y
        left
        light
        min-width="300"
        content-class="dropdown-menu"
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
        <v-btn icon slot="activator">
          <v-icon>search</v-icon>
        </v-btn>
        <v-list style="overflow: hidden !important">
          <v-list-tile>
            <v-text-field light single-line label="Search Speedsouls"></v-text-field>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-fab-transition>
      <v-btn
        v-if="scrollBackToTop"
        @click="$vuetify.goTo(0)"
        color="primary"
        dark
        fab
        fixed
        bottom
        right
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      scrollBackToTop: false,
      appTitle: "speedsouls",
      sidebar: false,
      menuItems: [
        { title: "Home", path: "/", icon: "home" },
        {
          title: "Leaderboards",
          path: "/leaderboards",
          icon: "developer_board"
        },
        { title: "Wiki", path: "/wiki", icon: "subject" },
        { title: "About", path: "/about", icon: "info" },
        { title: "Support Us", path: "/support", icon: "attach_money" }
      ],
      secondaryItems: [
        { title: "Discord", path: "/link-to-discord", icon: "fab fa-discord" },
        { title: "Twitter", path: "/link-to-twitter", icon: "fab fa-twitter" },
        { title: "Twitch", path: "/link-to-twitch", icon: "fab fa-twitch" }
      ]
    };
  },

  methods: {
    handleScroll() {
      const offset = (window.innerHeight / 5);
      this.scrollBackToTop = (document.documentElement.scrollTop > offset);
    }
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.dispatchEvent(new Event("scroll"));
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

