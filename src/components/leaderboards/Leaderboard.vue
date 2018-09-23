<template>
    <div>
        <sui-dropdown v-for="(sc, index) in subCategories.filter(v => v['is-subcategory'])"
                      selection
                      :key="sc.id"
                      :options="sc.options"
                      v-model="sc.current"
        ></sui-dropdown>

        <sui-checkbox
                label="Show filters"
                v-model="showFilters"
                v-if="subCategories.filter(v => !v['is-subcategory']).length > 0"
        ></sui-checkbox>

        <div class="filters"
             v-if="subCategories.filter(v => !v['is-subcategory']).length > 0 && showFilters">

            <div class="ui divider"></div>

            <sui-dropdown v-for="(sc, index) in subCategories.filter(v => !v['is-subcategory'])"
                          selection
                          :key="sc.id"
                          :options="sc.options"
                          v-model="sc.current"
            ></sui-dropdown>
        </div>

        <div class="ui divider hidden"></div>

        <div v-if="Mounted">
            <table class="ui segment single line selectable compact orange table" :class="{ loading: loading }">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Runner</th>

                    <!-- Primary timing method -->
                    <th>{{ timingMethodsNames[game.ruleset['default-time']] }}</th>

                    <!-- Other timing methods -->
                    <th v-for="timing_method in game.ruleset['run-times'].filter(tm => tm !== game.ruleset['default-time'])">
                        {{ timingMethodsNames[timing_method] }}
                    </th>

                    <!-- Variables -->
                    <th v-for="variable in variables.filter(v => !v['is-subcategory']) ">{{ variable.name }}</th>

                    <!-- Only platforms if the games has mutliple of them -->
                    <th v-if="platforms.length > 1">Platform</th>

                    <th>VOD</th>
                </tr>
                </thead>
                <tbody v-if="Mounted">
                <tr v-for="(run, index) in runs">
                    <!-- Rank -->
                    <td>{{ run.place }}</td>

                    <!-- Player's name -->
                    <td v-if="players[index].rel === 'user'">
                        <a :href="players[index].weblink" target="_blank">{{ players[index].names.international }}</a>
                    </td>
                    <td v-else>{{ players[index].name }}</td>

                    <!-- Primary timing -->
                    <td>{{ run.run.times.primary_t | formatTime }}</td>

                    <!-- Other timing methods /w FIX -->
                    <td v-if="needsFixing(game, run)"></td>
                    <td
                            v-else
                            v-for="timing_method in game.ruleset['run-times'].filter(tm => tm !== game.ruleset['default-time'])">
                        {{ run.run.times[timing_method + '_t'] | formatTime }}
                    </td>

                    <!-- Variables -->
                    <td
                            v-for="variable in variables.filter(v => !v['is-subcategory'])"
                            v-if="run.run.values[variable.id]"
                    >
                        {{ variable.values.values[run.run.values[variable.id]].label }}
                    </td>
                    <td v-else></td>

                    <!-- Platform -->
                    <td v-if="platforms.length > 1">{{ getPlatformNameById(run.run.system.platform) }}</td>

                    <!-- VOD -->
                    <td><a :href="run.run.weblink" target="_blank"><i class="video link icon"></i></a></td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>


</template>

<script>
    var api = require('../../api').default
    import {mapState} from 'vuex'

    export default {
        name: "leaderboard_c",
        data() {
            return {
                runs: [],
                players: [],

                subCategories: [],
                showFilters: false,
                loading: true,
            }
        },
        props: [
            'game',
            'category',
            'variables',
            'platforms'
        ],
        methods: {
            /**
             RTA NO LOAD HOTFIX (https://github.com/speedruncomorg/api/issues/69)

             There is currently a bug in the SpeedRun.com API where games using RTA No Load as a primary timing
             method, if a run only has an RTA time, the API will return a empty RTA No Load time and move that
             value to the RTA column.

             But because of the way the Dark Souls 2 leaderboards are done, runs can only either :
             - Have both RTA no load and RTA times
             - Have only RTA no load time

             So if we find a run with :
             - Only RTA time

             Then we know it's an API bug. We move that value to primary and ignore the other timing methods

             * @return {boolean}
             */
            needsFixing: function (game, run) {
                return (
                    game.ruleset['default-time'] === this.timingMethodToFix &&
                    run.run.times[this.timingMethodToFix] === null
                )
            },
            getPlatformNameById: function (id) {
                var index = this.platforms.findIndex(p => p.id === id)
                return index !== -1 ? this.platforms[index].name : ''
            },
            getSubCategories: function () {
                /**
                 * sub categories formatting for dropdown
                 */
                var _subCategories = []
                for (var variable in this.variables) {

                    var subCategory = {
                        id: this.variables[variable].id,
                        current: (this.variables[variable]['is-subcategory']) ?
                            Object.keys(this.variables[variable].values.values)[0] :
                            -1 ,
                        'is-subcategory': this.variables[variable]['is-subcategory'],
                        options: []
                    }

                    if (!this.variables[variable]['is-subcategory']) {
                        subCategory.options.push({
                            text: 'Any',
                            value: -1
                        })
                    }

                    for (var value in this.variables[variable].values.values) {
                        subCategory.options.push({
                            text: this.variables[variable].values.values[value].label,
                            value: value
                        })
                    }

                    _subCategories.push(subCategory)
                }

                // This will trigger the watch listener on this.subCategories and populate the leaderboards
                this.subCategories = _subCategories
            },
            getLeaderboard: function () {
                this.loading = true

                console.log('Within leaderboard subC', this.subCategories)

                api.getLeaderboard(this.game.id, this.category.id, this.subCategories, (error, leaderboard) => {
                    this.loading = false

                    if (error) return console.log('Error with the API')

                    console.log('Within leaderboard LB', leaderboard)

                    this.runs = leaderboard.data.runs
                    this.players = leaderboard.data.players.data
                })
            },
        },
        computed: {
            ...mapState([
                'timingMethodsNames',
                'timingMethodToFix'
            ]),
            /**
             * @return {boolean}
             */
            Mounted: function () {
                return this.runs.length
            },
        },
        watch: {
            /**
             * This will be triggered when the page
             */
            category: {
                immediate: true,
                handler() {
                    this.getSubCategories()
                },
            },
            subCategories: {
                immediate: true,
                deep: true,
                handler() {
                    console.log('sub category changed', this.subCategories)
                    this.getLeaderboard()
                },
            },
        },
        updated() {

        }
    }
</script>

<style scoped>

</style>