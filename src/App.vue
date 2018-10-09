<template>
    <v-app>
        <Navbar></Navbar>
        <v-content>
            <v-container grid-list-md text-xs-center>
                <router-view v-if="Mounted"></router-view>
                <v-flex xs12 v-else>
                    <v-progress-circular
                            :size="50"
                            :width="7"
                            color="primary"
                            indeterminate
                    ></v-progress-circular>
                </v-flex>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Navbar from './components/Navbar.vue';

export default {
    name: 'App',
    data: () => ({
        picker: null,
        landscape: false,
        reactive: false,
    }),
    computed: {
        ...mapGetters(['Mounted']),
    },
    components: {
        Navbar,
    },
    watch: {
        $route() {
            console.log('Route changed', this.$route.matched);
        },
    },
    methods: {
        ...mapActions(['updateGames']),
    },
    created() {
        this.updateGames();
    },
};
</script>

<style>
#app {

}
</style>
