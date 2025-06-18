<template>
  <div class="background page-container">
    <v-container>
      <!-- Bouton de création -->
      <div class="button-container">
        <v-btn text to="/createabattlereport" class="mb-4 button">
          <v-icon left>mdi-plus</v-icon>
          Créer un nouveau rapport
        </v-btn>
      </div>

      <!-- Filtres -->
      <v-card class="mb-4 card-container">
        <v-card-title>Filtres</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-select v-model="selectedFaction" :items="factions" label="Faction" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="selectedOpponent" :items="opponents" label="Adversaire" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="selectedScenario" :items="scenarios" label="Scénario" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="selectedPoints" label="Nombre de points" type="number" outlined></v-text-field>
            </v-col>
          </v-row>

          <v-btn text class="reset-button" @click="resetFilters">
            Réinitialiser les filtres
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Liste des rapports -->
      <v-row>
        <v-col v-for="report in filteredReports" :key="report.id" cols="12" md="6" lg="4">
          <router-link :to="`/battlereportview`" style="text-decoration: none;">
            <v-card class="card-container battle-card" hover>
              <div class="battle-images-container">
                <template v-if="report.players.length > 4">
                  <div class="battle-image full" :style="{ backgroundImage: 'url(/img/armees/tow-battle.png)' }"></div>
                </template>
                <template v-else>
                  <div
                    v-for="(alliance, index) in groupedByAlliance(report.players)"
                    :key="index"
                    :class="{
                      'battle-image alliance-group': true,
                      'single-army': alliance.singleArmy
                    }"
                    :style="{
                      width: 100 / groupedByAlliance(report.players).length + '%'
                    }"
                  >
                    <div
                      v-for="player in alliance"
                      :key="player.name"
                      class="player-image"
                      :style="{ backgroundImage: `url(${player.armyImage})` }"
                    ></div>
                  </div>
                </template>
              </div>

              <v-card-title class="mt-2">{{ report.title }}</v-card-title>

              <!-- Armées dynamiques en fonction des alliances -->
              <v-card-subtitle class="d-flex align-center justify-center">
                <template v-for="(alliance, index) in groupedByAlliance(report.players)" :key="index">
                  <span>
                    {{
                      alliance.map(player => getArmyNameFromImage(player.armyImage)).join(' / ')
                    }}
                  </span>
                  <v-icon
                    v-if="index < groupedByAlliance(report.players).length - 1"
                    class="mx-2"
                    color="grey lighten-2"
                  >
                    mdi-sword-cross
                  </v-icon>
                </template>
              </v-card-subtitle>

              <v-card-text>{{ report.points }} points - {{ report.scenario }}</v-card-text>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>

      <v-snackbar v-model="snackbar" :timeout="5000" location="bottom right" color="success">
      Le Rapport de Bataille a bien été enregistré
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const reports = ref([]);
const snackbar = ref(false);

const factions = ref(['Empire', 'Bretonnie', 'Kislev', 'Orques']);
const opponents = ref(['Elfes Noirs', 'Skavens', 'Vampires']);
const scenarios = ref(['Bataille Ouverte', 'Scénario Officiel', 'Autre']);

const selectedFaction = ref('');
const selectedOpponent = ref('');
const selectedScenario = ref('');
const selectedPoints = ref(null);

function resetFilters() {
  selectedFaction.value = '';
  selectedOpponent.value = '';
  selectedScenario.value = '';
  selectedPoints.value = null;
}

const filteredReports = computed(() => {
  return reports.value.filter(report => {
    return (
      (!selectedFaction.value || report.faction === selectedFaction.value) &&
      (!selectedOpponent.value || report.opponent === selectedOpponent.value) &&
      (!selectedScenario.value || report.scenario === selectedScenario.value) &&
      (!selectedPoints.value || report.points === selectedPoints.value)
    );
  });
});

function groupedByAlliance(players) {
  const alliances = {};
  for (const player of players) {
    const key = player.alliance && player.alliance !== 'Aucune' ? player.alliance : player.name;
    if (!alliances[key]) alliances[key] = [];
    alliances[key].push(player);
  }

  const grouped = Object.values(alliances);

  // Si une seule alliance est présente, lui appliquer la classe "single-army"
  if (grouped.length === 1) {
    grouped[0].singleArmy = true;
  }

  return grouped;
}

function getArmyNameFromImage(imagePath) {
  const name = imagePath
    .split('/').pop()
    .replace('tow-', '')
    .replace('.png', '')
    .replace(/-/g, ' ');

  return capitalizeWords(name);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

function fetchReports() {
  reports.value = [
    {
      id: 1,
      title: 'Bataille pour Kislev',
      faction: 'Kislev',
      opponent: 'Skavens',
      scenario: 'Bataille Ouverte',
      points: 2000,
      players: [
        { name: 'Joueur 1', armyImage: '/img/armees/tow-empire.png', alliance: 'Alliance 1' },
        { name: 'Joueur 2', armyImage: '/img/armees/tow-skaven.png', alliance: 'Alliance 2' }
      ]
    },
    {
      id: 2,
      title: 'Charge des Bretonniens',
      faction: 'Bretonnie',
      opponent: 'Elfes Noirs',
      scenario: 'Scénario Officiel',
      points: 1500,
      players: [
        { name: 'Joueur 1', armyImage: '/img/armees/kingdom-of-bretonnia.png', alliance: 'Alliance 1' },
        { name: 'Joueur 2', armyImage: '/img/armees/tow-dark-elves.png', alliance: 'Alliance 2' },
        { name: 'Joueur 3', armyImage: '/img/armees/tow-skaven.png', alliance: 'Alliance 1' },
        { name: 'Joueur 4', armyImage: '/img/armees/tow-vampire.png', alliance: 'Aucune' }
      ]
    },
    {
      id: 3,
      title: 'Mêlée Générale',
      faction: 'Empire',
      opponent: 'Orques',
      scenario: 'Autre',
      points: 2500,
      players: [
        { name: 'J1', armyImage: '/img/armees/tow-empire.png', alliance: 'Aucune' },
        { name: 'J2', armyImage: '/img/armees/tow-skaven.png', alliance: 'Aucune' },
        { name: 'J3', armyImage: '/img/armees/tow-kislev.png', alliance: 'Aucune' },
        { name: 'J4', armyImage: '/img/armees/tow-bretonnia.png', alliance: 'Aucune' },
        { name: 'J5', armyImage: '/img/armees/tow-orcs.png', alliance: 'Aucune' }
      ]
    }
  ];
}

onMounted(fetchReports);

onMounted(() => {
  // Vérifiez le stockage local pour le message
  const reportSuccess = localStorage.getItem('battleReportSuccess');
  if (reportSuccess) {
    snackbar.value = true;
    // Supprimez le message du stockage local après l'avoir affiché
    localStorage.removeItem('battleReportSuccess');
  }
});
</script>


<style scoped>
.background {
  background: url('/img/background3.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px;
}

.page-container {
  margin-top: 80px;
  background-color: #211510;
  min-height: 100vh;
}

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

.button {
  background-color: #332018;
  color: #EBDEC2;
}

.battle-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.battle-card:hover {
  transform: scale(1.02);
  image-rendering: auto;
}

.battle-images-container {
  position: relative;
  width: 100%;
  height: 180px; /* Ajuste cette hauteur si nécessaire */
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.battle-image {
  flex: 1;
  background-size: cover; /* Garantit que l'image prend toute la surface sans déformation */
  background-repeat: no-repeat;
  background-position: center center;
  height: 100%;
  image-rendering: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

.battle-image.full {
  width: 100%;
}

.battle-image.alliance-group {
  display: flex;
  flex-direction: row; /* Affiche les armées côte à côte */
  justify-content: space-between;
  width: 100%; /* Prend toute la largeur disponible */
}

.player-image {
  flex: 1; /* Chaque image occupe une part égale de la largeur disponible */
  height: 100%; /* Prend la hauteur de la parent */
  background-size: cover; /* Remplir l'image sans la déformer */
  background-position: center;
  margin: 0 2px; /* Espacement entre les images */
}

/* Si une armée est seule face à plusieurs armées */
.battle-image.single-army {
  flex: 2; /* Prend deux fois la largeur d'une armée normale */
}

.battle-images-container {
  position: relative;
  width: 100%;
  height: 200px; /* Ajuste selon la hauteur souhaitée */
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}


.center-divider {
  width: 8px;
  background-color: #EBDEC2;
  height: 100%;
  z-index: 2;
}

.vs-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 4px;
  color: #EBDEC2;
}

.battle-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.battle-details {
  font-size: 0.9rem;
  opacity: 0.8;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.reset-button {
  display: block;
  margin-top: 10px;
  color: #332018;
  border: 1px solid #EBDEC2;
  background-color: #EBDEC2;
}

.reset-button:hover {
  background-color: #EBDEC2;
  color: #332018;
}
</style>
