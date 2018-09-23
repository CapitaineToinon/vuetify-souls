<template>
    <div v-if="Mounted" class="ui grid container">

            <div class="four wide column">
                <h1>{{ game.names.international }}</h1>
                <img class="ui image centered rounded" :src="game.assets['cover-large'].uri"/>
            </div>

            <div class="twelve wide column">

                <sui-dropdown
                              selection
                              :options="categoriesOption"
                              v-model="selectedCategory"
                ></sui-dropdown>

                <Leabderboard
                        :game="game"
                        :category="category"
                        :variables="variables"
                        :platforms="platforms"
                        ></Leabderboard>
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
            categoriesOption: function(){
                var options = []
                this.game.categories.data.forEach((c, i) => options.push({
                    text: c.name,
                    value: i
                }))

                return options
            },
            category : function() {
                return this.game.categories.data[this.selectedCategory]
            },
            variables: function () {
                return this.game.variables.data.filter(v => v.category === this.category.id)
            },
            platforms: function() {
                return this.game.platforms.data
            },
            ...mapGetters([
                'getGameByAbb',
                'Mounted'
            ]),
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>