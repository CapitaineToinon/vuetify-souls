import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Base.vue"),
      name: "home"
    },
    {
      path: "/recentruns",
      component: () => import("@/views/RecentRuns.vue"),
      name: "recentruns",
    },
    {
      path: "/leaderboards",
      component: () => import("@/views/Leaderboards/Index.vue"),
      children: [
        {
          path: "",
          name: "gamelist",
          component: () => import("@/views/Leaderboards/GamesList.vue")
        },
        {
          path: ":abbreviation",
          name: "leaderboard",
          component: () => import("@/views/Leaderboards/Leaderboard.vue")
        },
        {
          path: ":abbreviation/:id",
          name: "run",
          component: () => import("@/views/Leaderboards/Run.vue")
        },
      ]
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/About.vue"),
      meta: {
        flatToolbar: true,
      }
    },
    {
      path: "/live",
      name: "live",
      component: () => import("@/views/Live.vue"),
    },
    {
      path: "**",
      name: "redirect",
      component: () => import("@/views/Redirect.vue"),
    },
  ]
});
