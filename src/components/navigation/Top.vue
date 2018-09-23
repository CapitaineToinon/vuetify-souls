<template>
    <div class="ui fixed menu">
        <div class="ui container">
            <router-link :to="{ name: 'root' }" class="header item">Home</router-link>
            <router-link :to="{ name: 'Leaderboards' }" class="header item">Leaderboards</router-link>

            <div
                    class="ui simple dropdown item"
                    v-model="Mounted"
                    v-bind:class="{ disabled: !Mounted, loading: !Mounted }"
            >
                <div class="text">Games</div>
                <i class="dropdown icon"></i>
                <div class="menu">
                    <router-link
                            tag="div"
                            class="item"
                            v-for="game in Games"
                            v-model="Games"
                            :key="game.id"
                            :to="{ name: 'Game', params: { abbreviation: game.abbreviation } }"
                    >{{ game.names.international }}
                    </router-link>
                </div>
            </div>
            <router-link :to="{ name: 'About' }" class="header item">About</router-link>
            <a @click="setGames" class="header item">Get Games</a>
            <a @click="unsetGames" class="header item">Unset Games</a>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "top_c",
        data() {
            return {

            }
        },
        computed: {
            ...mapGetters([
                'Games',
                'gamesCount',
                'Mounted'
            ])
        },
        methods: {
            ...mapMutations([
                'clearGames',
                'updateGames'
            ]),
            setGames() {
                this.updateGames()
            },
            unsetGames() {
                this.clearGames()
            }
        }
    }
</script>

<style scoped>

</style>