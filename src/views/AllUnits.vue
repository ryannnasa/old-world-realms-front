<template>
  <div class="background, page-container">
    <div class="character-cards">
      <div class="character-card" v-for="unit in unitsName" :key="unit.idUnitName">
        <div class="character-image">
          <img src="/public/img/Bretonniens/BREChevaliersDeLaQuete01.jpg" alt="Image personnage" />
        </div>
        <div class="character-details">
          <h2 class="character-title">{{ unit.unitName }}</h2>
          <h3 class="character-subtitle">Personnage</h3>
          <p class="character-description">Description à compléter...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
function toHomePage() {
  router.push('/homepage');
}
/*
const props = defineProps(['searchQuery'])
const searchNomUnite = computed(function(){
  return nomUnites.value.filter(function(currentNomUnite){
    return currentNomUnite.nomUnite.startsWith(props.searchQuery)
  })
})
*/
// Stocke les unités récupérées
const unitsName = ref<{ idUnitName: number; unitName: string }[]>([]);

watch(unitsName, () => console.log(unitsName))
// Stocke le nom de l'utilisateur
const JP = ref<string | null>(null);

/*
// Récupération du nom de l'utilisateur
function fetchUser() {
  fetch("http://localhost:8080/user")
    .then(res => res.json())
    .then(data => JP.value = data.username)
    .catch(err => console.error("Erreur API:", err));
}
*/
function fetchUnitName() {
  fetch("http://localhost:8080/unitname")
    .then(res => res.json())
    .then(data => unitsName.value = data)
    .catch(err => console.error("Erreur API:", err));
}

// Charger les données au montage du composant

  fetchUnitName();
  //fetchUser();

</script>

<style scoped>
.character-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.character-card {
  display: flex;
  flex-direction: row;
  background: url('/img/background2.webp');
  border: 1px solid #5a3e26;
  border-radius: 8px;
  overflow: hidden;
  width: 800px;
  margin: 20px;
}

.character-image {
  width: 200px;
  height: 200px;
  border-radius: 8px 0 0 8px;
  overflow: hidden;
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-details {
  flex: 1;
  padding: 10px;
  color: #f0e6d2;
}

.character-title {
  font-size: 18px;
  color: #ffcc00;
}

.character-subtitle {
  font-size: 14px;
  color: #e5c07b;
}

.character-description {
  font-size: 12px;
  color: #f0e6d2;
  margin-top: 5px;
}
</style>
