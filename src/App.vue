<template>
  <v-app class="background">

    <Navbar @on-search="onSearch" />
    <RouterView />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '././components/Navbar.vue';
import HomeView from './views/AllUnits.vue';
import { ref } from 'vue';
const searchQueryRef = ref("")
function onSearch(searchQuery : string){
 searchQueryRef.value = searchQuery
};
</script>

<style scoped>

.background {
  background: url('/img/background3.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;

}


.page-container {
  margin-top: 80px;
  background: transparent;
  min-height: 100vh;
  padding: 20px;
}

</style>

<style>
/* Retirer les flèches sur input type number dans Chrome, Edge, Safari */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Retirer les flèches sur Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
