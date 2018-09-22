import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'root',
            component: HelloWorld
        },
        {
            path: '/leaderboards',
            name: 'Leaderboards',
            component: resolve => require(['../components/Leaderboards'], resolve),
        },
        {
            path: '/leaderboards/:abbreviation',
            name: 'Game',
            component: resolve => require(['../components/leaderboards/Game'], resolve),
        },
        {
            path: '/about',
            name: 'About',
            component: resolve => require(['../components/About'], resolve)
        },
        {
            path: '*',
            redirect: { name: 'root' }
        }
    ]
})
