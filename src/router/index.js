import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import About from '../components/About.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'root',
            component: HelloWorld,
        },
        {
            path: '/about',
            name: 'about',
            component: resolve => resolve(About),
        },
        {
            path: '*',
            redirect: { name: 'root' },
        },
    ],
});
