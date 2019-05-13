<template>
  <div class="py-2 text-xs-left text-md-center run-card">
    <v-layout row wrap align-space-around>
      <v-flex xs12 order-xs1 order-sm1 order-md1 order-lg1 sm6 md4 lg3 class="px-1">
        <slot name="game">Game</slot>
      </v-flex>
      <v-flex xs12 order-xs2 order-sm3 order-md4 order-lg2 sm6 md4 lg3 class="px-1">
        <slot name="category">Category</slot>
      </v-flex>
      <v-flex xs12 order-xs4 order-sm2 order-md2 order-lg3 sm6 md4 lg3 class="px-1">
        <slot name="player">Player</slot>
      </v-flex>
      <v-flex xs12 order-xs3 order-sm4 order-md5 order-lg4 sm6 md4 lg2 class="px-1">
        <slot name="time">Time</slot>
      </v-flex>
      <v-flex xs12 order-xs3 order-sm5 order-md3 order-lg5 sm6 md4 lg1 class="px-1">
        <slot name="date">Date</slot>
      </v-flex>
    </v-layout>
  </div>
</template>


