<template>
  <v-app-bar dark class="my-app-bar">
    <div class="d-flex align-center justify-space-between w-90">
      <a href="/homepage" class="logo-link">
        <img src="/img/Logo Old World Realms.png" alt="Logo" class="logo">
      </a>

      <v-btn text to="/homepage" router>Accueil</v-btn>
      <v-btn text to="/allbattlereports" router>Mes Rapports de Batailles</v-btn>
      <v-btn text to="/createabattlereport" router>Créer un Rapport de Bataille</v-btn>

      <v-spacer></v-spacer>
      <div ref="searchContainer" class="search-container">
        <v-btn icon @click.stop="toggleSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-expand-x-transition>
          <v-text-field
            v-if="showSearch"
            ref="searchInput"
            v-model="searchQuery"
            dense
            solo-inverted
            hide-details
            placeholder="Rechercher..."
            class="search-bar"
            @focus="keepSearchOpen"
            @click.stop
          />
        </v-expand-x-transition>
      </div>
      <v-btn icon text to="/myaccount" router>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";

const showSearch = ref(false);
const searchQuery = ref("");
const emit = defineEmits(['onSearch'])
watch(searchQuery, function (){
  emit('onSearch',searchQuery.value)
})
const searchContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLElement | null>(null);

const toggleSearch = async () => {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    await nextTick();
    searchInput.value?.focus();
  }
};

const keepSearchOpen = () => {
  showSearch.value = true;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainer.value &&
    !searchContainer.value.contains(event.target as Node)
  ) {
    showSearch.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.my-app-bar {
  margin-top: 16px;
  border-radius: 16px;
  height: 64px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  left: 50% !important;
  transform: translateX(-50%) !important;
  max-width: 80%;
  background-color: #332018 !important;
  color: white !important;
  opacity : 0.9 !important;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-bar {
  width: 200px;
  transition: width 0.3s ease-in-out;
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: scaleX(0);
  opacity: 0;
}

</style>
