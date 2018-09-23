<template>
    <div>
        <h1>New leaderboards page</h1>
        <p>Maybe have a way to list all games nicely on one page and get rid of the "Games" dropdown in the navbar</p>
        <router-view></router-view>

        <sui-dropdown
                placeholder="Gender"
                selection
                :options="options"
                v-model="current"
        ></sui-dropdown>

    </div>
</template>

<script>
    export default {
        name: "leaderboards_c",
        data() {
            return {
                current: 'bit',
                options: [{
                    text: 'Male de merde',
                    value: 'connard',
                }, {
                    text: 'Female',
                    value: 'bit',
                }],
            };
        },
        watch: {
            current: function() {
            }
        },
        mounted() {

        },
        updated() {
        }
    }
</script>

<style scoped>

</style>