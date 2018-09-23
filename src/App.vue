<template>
    <div id="app">
        <navigationTop></navigationTop>
        <router-view/>
    </div>
</template>

<script>
    import navigationTop from './components/navigation/Top'
    import {mapMutations} from 'vuex'

    window.$ = require('jquery')
    window.JQuery = require('jquery')

    export default {
        name: 'App',
        data() {
            return {

            }
        },
        components: {
            navigationTop,
        },
        methods: {
            ...mapMutations([
                'updateGames' // map `this.clearGames()` to `this.$store.commit('clearGames')`
            ]),
        },
        mounted() {
            this.updateGames()
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
