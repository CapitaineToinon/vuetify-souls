import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routerOptions = [
  { path: '/', component: 'Base' },
  { path: '/leaderboards', component: 'Leaderboards' },
  { path: '/about', component: 'About' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

export default new Router({
  mode: 'history',
  routes
})
