<template>
    <v-flex xs12>
        <ul>
            <li
                v-for="(item, index) in items"
                :key="index">{{ item }}</li>
        </ul>
    </v-flex>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data: () => ({
        msg: 'Welcome to Your Vue.js App',
    }),
    computed: {
        ...mapGetters([
            'Games',
        ]),
        items() {
            return this.Games.map(game => game.names.international);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
