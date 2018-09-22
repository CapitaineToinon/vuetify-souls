<template>
    <div v-if="Mounted" class="ui grid container">

            <div class="four wide column">
                <h1>{{ game.names.international }}</h1>
                <img class="ui image centered rounded" :src="game.assets['cover-large'].uri"/>

                <div class="ui compact menu">
                    <div class="ui simple dropdown item">
                        Dropdown
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <div
                                    class="item"
                                    v-for="(category, index) in categories"
                                    :key="index"
                                    :data-value="index"
                                    @click="setCategory(index)"
                            >{{ category.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="twelve wide column">
                <Leabderboard :categoryId="categories[selectedCategory].id" :game="game"></Leabderboard>
            </div>
        </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import Leabderboard from "./Leaderboard";

    export default {
        name: "game_c",
        components:
            {
                Leabderboard: Leabderboard
            },
        data() {
            return {
                selectedCategory: 0
            }
        },
        watch: {
            '$route.params.abbreviation': {
                immediate: true,
                handler() {
                    this.selectedCategory = 0
                    console.log(this.$route.params.abbreviation)
                }
            },
        },
        methods: {
            setCategory: function (index) {
                this.selectedCategory = index
            },
        },
        computed: {
            game: function () {
                return this.getGameByAbb(this.$route.params.abbreviation)
            },
            categories : function() {
                return  this.game.categories.data
            },
            ...mapGetters([
                'getGameByAbb',
                'Mounted'
            ]),
        },
        mounted() {
            console.log('Game page')
        }
    }
</script>

<style scoped>

</style>