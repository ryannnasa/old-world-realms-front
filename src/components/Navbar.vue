<template>
  <v-app-bar dark class="my-app-bar">
    <div class="d-flex align-center justify-space-between w-100">
      <a href="/Accueil" class="logo-link">
        <img src="/img/Logo Old World Realms.png" alt="Logo" class="logo">
      </a>

      <v-btn>Règles du Jeu</v-btn>
      <v-btn text to="/armee">Armées</v-btn>
      <v-btn text>Listes d'Armées</v-btn>
      <v-btn text to="/rapports-batailles" router>Rapports de Batailles</v-btn>

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

      <v-btn text>Soutenir</v-btn>
      <v-btn>Compte</v-btn>
      <v-btn icon >
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

// Ferme la barre si on clique en dehors
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
  height: 64px; /* Hauteur de la toolbar */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 90%;
  padding-left: 16px;
  padding-right: 16px;
  
  /* Changer la couleur de fond de la toolbar */
  background-color: #61503b !important; /* Exemple avec une couleur bleue foncée */

  color: white !important; /* Les éléments à l'intérieur de la toolbar auront la couleur blanche */
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centrer verticalement les éléments */
  width: 100%;
}

.logo-link {
  display: flex; /* Utilise flexbox pour centrer le logo */
  align-items: center; /* Centrer verticalement le logo */
  justify-content: center; /* Centrer horizontalement le logo */
  height: 100%;
}

.logo {
  height: 80px; /* Ajuster la hauteur du logo à une taille fixe */
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
