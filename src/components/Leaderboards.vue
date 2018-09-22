<template>
    <div>
        <h1>New leaderboards page</h1>
        <p>Maybe have a way to list all games nicely on one page and get rid of the "Games" dropdown in the navbar</p>
        <router-view></router-view>

        <div class="ui selection dropdown">
            <input type="hidden" name="gender">
            <i class="dropdown icon"></i>
            <div class="default text">Gender</div>
            <div class="menu">
                <div class="item" data-value="1">Male</div>
                <div class="item" data-value="0">Female</div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "leaderboards_c",
        mounted() {
            $('.ui.dropdown')
                .dropdown()
            ;
        }
    }
</script>

<style scoped>

</style>