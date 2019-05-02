import Vue from "vue";
import Router from "vue-router";
import Base from "@/views/Base.vue";
import About from "@/views/About.vue";
import Live from "@/views/Live.vue";
import Leaderboard from "@/views/Leaderboards/Index.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      component: Base,
      name: "home",
    },
    {
      path: "/leaderboards",
      component: Leaderboard,
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
      component: About,
    },
    {
      path: "/live",
      name: "live",
      component: Live,
    },
    {
      path: "**",
      name: "redirect",
      component: () => import("@/views/Redirect.vue"),
    },
  ]
});
