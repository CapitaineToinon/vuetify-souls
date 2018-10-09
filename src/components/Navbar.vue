<template>
    <div>
        <v-navigation-drawer
                v-model="drawer"
                temporary
                app
        >
            <v-list class="pa-1">
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img src="https://randomuser.me/api/portraits/men/85.jpg">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>John Leider</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>

            <v-list class="pt-0" dense>
                <v-divider></v-divider>

                <router-link
                        v-for="(route, key) in routes"
                        :key="key"
                        tag="v-list-tile"
                        :to="{ name: route.name }"
                >
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ route.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </router-link>

            </v-list>
        </v-navigation-drawer>

        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>SpeedSouls</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">

                <router-link
                        v-for="(route, key) in routes"
                        :key="key"
                        tag="v-btn"
                        class="v-btn--flat"
                        :to="{ name: route.name }"
                >
                    {{ route.title }}
                </router-link>
            </v-toolbar-items>
        </v-toolbar>
    </div>

</template>

<script>
export default {
    name: 'top_c',
    data: () => ({
        routes: [
            { name: 'root', title: 'Home' },
            { name: 'about', title: 'About' },
        ],
        drawer: null,
    }),
};
</script>

<style scoped>

</style>
