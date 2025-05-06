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
  padding: 0;
}


.page-container {
  margin-top: 80px;
  background: transparent;
  min-height: 100vh;
  padding: 20px;
}
</style>
