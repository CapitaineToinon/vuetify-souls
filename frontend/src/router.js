import Vue from "vue";
import Router from "vue-router";
import Base from "@/views/Base.vue";
import Leaderboard from "@/views/Leaderboards/Index.vue";
import GamesList from "@/views/Leaderboards/GamesList.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Base,
      name: "home",
    },
    {
      path: "/leaderboards",
      component: Leaderboard, //() => import("@/views/Leaderboards/Index.vue"),
      children: [
        {
          path: "",
          name: "gamelist",
          component: GamesList, // () => import("@/views/Leaderboards/GamesList.vue")
        },
        {
          path: ":abbreviation",
          name: "leaderboard",
          component: () => import("@/views/Leaderboards/Leaderboard.vue")
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      component: import("@/views/About.vue")
    }
  ]
});
