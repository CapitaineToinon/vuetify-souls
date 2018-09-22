<template>
    <div>
        <table class="ui segment single line selectable compact orange table" :class="{ loading: loading }">
            <thead v-if="Mounted">
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

                <!-- Other timing methods -->
                <td v-for="timing_method in game.ruleset['run-times'].filter(tm => tm !== game.ruleset['default-time'])">
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

                <!-- VOD -->
                <td><a :href="run.run.weblink" target="_blank"><i class="video link icon"></i></a></td>
            </tr>
            </tbody>
        </table>
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
                variables: [],
                loading: true,
            }
        },
        props: [
            'game',
            'categoryId'
        ],
        methods: {
            getLeaderboard: function () {
                this.loading = true
                api.getLeaderboard(this.game.id, this.categoryId, (error, leaderboard) => {
                    if (error) return console.log('Error with the API')
                    this.runs = leaderboard.data.runs
                    this.players = leaderboard.data.players.data
                    this.variables = leaderboard.data.variables.data
                    this.loading = false
                })
            }
        },
        computed: {
            ...mapState([
               'timingMethodsNames'
            ]),
            /**
             * @return {boolean}
             */
            Mounted: function () {
                return this.runs.length
            },
        },
        watch: {
            categoryId: {
                immediate: true,
                handler() {
                    this.getLeaderboard()
                },
            },
        },
    }
</script>

<style scoped>

</style>