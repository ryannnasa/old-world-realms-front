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
              <v-select v-model="selectedFaction" :items="factions" label="Armée jouée" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="selectedOpponent" :items="opponents" label="Armée Adverse" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select v-model="selectedScenario" :items="scenarios" label="Scénario" outlined></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model.number="selectedPoints" label="Points" type="number" outlined clearable></v-text-field>
            </v-col>
          </v-row>

          <v-btn text class="reset-button" @click="resetFilters">
            Réinitialiser les filtres
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Liste des rapports -->
      <v-row>
        <v-col
          v-for="report in filteredReports"
          :key="report.id"
          cols="12"
          md="6"
          lg="4"
        >
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
  class="battle-image alliance-group"
  :class="{ 'single-army': alliance.singleArmy }"
  :style="{ width: 100 / groupedByAlliance(report.players).length + '%' }"
>
  <div
  v-for="player in alliance"
  :key="player.name"
  class="player-image"
  :title="player.army"
  :style="{
    backgroundImage: player.armyImage ? `url('${player.armyImage}')` : 'url(/path/to/default/image.png)'
  }"
>
</div>

</div>


</template>

              </div>

              <v-card-title class="mt-2">{{ report.title }}</v-card-title>

              <v-card-subtitle class="d-flex align-center justify-center">
                <template v-for="(alliance, index) in groupedByAlliance(report.players)" :key="index">
  <span>
    {{ alliance.map(player => player.name).join(' / ') }}
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

              <v-card-text>{{ report.points }} points</v-card-text>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-snackbar v-model="snackbar" :timeout="5000" location="bottom right" color="success">
  Le Rapport de Bataille a bien été enregistré
  <template v-slot:actions>
    <v-btn color="white" variant="text" @click="closeSnackbar">Fermer</v-btn>
  </template>
</v-snackbar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';

const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();
const scenarioStore = useScenarioStore();

const reports = ref([]);
const snackbar = ref(false);

const factions = computed(() => {
  return armyNameStore.armyName.map(a => a.nameArmyName);
});
const opponents = computed(() => {
  return armyNameStore.armyName.map(a => a.nameArmyName);
});
const scenarios = computed(() => {
  return scenarioStore.scenario.map(s => s.scenarioName);
});

// POINTS OPTIONS FIXES (500 à 3000)
const pointsOptions = computed(() => {
  const options = [];
  for (let p = 500; p <= 3000; p += 250) {
    options.push(p);
  }
  return options;
});

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
    const firstPlayer = report.players[0];
    if (!firstPlayer) return false;

    const firstAllianceId = firstPlayer.allianceId;
    const isFirstPlayerAlone = !firstAllianceId || firstAllianceId === 3;

    const enemyPlayers = report.players.filter(p => {
      if (p.name === firstPlayer.name) return false;
      if (isFirstPlayerAlone) {
        return p.allianceId !== 3 && p.allianceId !== undefined;
      }
      return p.allianceId !== firstAllianceId;
    });

    const enemyArmies = enemyPlayers.map(p => p.army);

    return (
      (!selectedFaction.value || report.faction === selectedFaction.value) &&
      (!selectedOpponent.value || enemyArmies.includes(selectedOpponent.value)) &&
      (!selectedScenario.value || report.scenario === selectedScenario.value) &&
      (!selectedPoints.value || report.points === selectedPoints.value)
    );
  });
});

function getScenarioName(scenarioId) {
  const scenario = scenarioStore.scenario.find(s => s.idScenario === scenarioId);
  return scenario ? scenario.scenarioName : 'Inconnu';
}

function groupedByAlliance(players) {
  if (!Array.isArray(players)) return [];

  const alliances = {};
  for (const player of players) {
    const key = player.alliance && player.alliance !== 'Aucune' ? player.alliance : player.name;
    if (!alliances[key]) alliances[key] = [];
    alliances[key].push(player);
  }

  const grouped = Object.values(alliances);
  if (grouped.length === 1) grouped[0].singleArmy = true;

  return grouped;
}

function getArmyImageUrl(armyId) {
  const photo = armyPhotoStore.armyPhoto.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png';
}

function getArmyName(armyId) {
  const army = armyNameStore.armyName.find(a => a.idArmyName === armyId);
  return army ? army.nameArmyName : 'Inconnu';
}

function getAllianceName(allianceId) {
  const alliance = allianceStore.alliance.find(a => a.idAlliance === allianceId);
  return alliance ? alliance.nameAlliance : 'Aucune';
}

function getArmyNameFromImage(imageUrl) {
  const photo = armyPhotoStore.armyPhoto.find(p => `/img/armees/${p.image_ArmyPhoto}` === imageUrl);
  if (photo) {
    const army = armyNameStore.armyName.find(a => a.idArmyName === photo.armyName_idArmyName);
    return army ? army.nameArmyName : 'Inconnu';
  }
  return 'Inconnu';
}

function fetchReports() {
  console.log('Début récupération des données...');
  return armyPhotoStore.getArmyPhoto()
    .then(() => armyNameStore.getArmyName())
    .then(() => allianceStore.getAlliance())
    .then(() => battleReportStore.getBattleReport())
    .then(() => {
      console.log('BattleReports bruts :', battleReportStore.battleReports);

      reports.value = battleReportStore.battleReports.map(report => {
        const players = report.players?.map(p => ({
          name: p.playerName,
          allianceId: p.alliance_idAlliance,
          alliance: getAllianceName(p.alliance_idAlliance),
          army: getArmyName(p.armyName_idArmyName),
          armyImage: getArmyImageUrl(p.armyName_idArmyName),
          score: p.playerScore
        })) ?? [];

        return {
          id: report.idBattleReport,
          title: report.nameBattleReport,
          description: report.descriptionBattleReport,
          scenario: getScenarioName(report.scenario_idScenario),
          points: Number(report.armyPoints), // Bien en Number
          faction: players[0]?.army || '',
          opponent: players[1]?.army || '',
          players
        };
      });

      console.log('Reports transformés :', reports.value);
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des rapports de bataille :', err);
    });
}

const loading = ref(true);

onMounted(() => {
  Promise.all([
    armyPhotoStore.getArmyPhoto(),
    armyNameStore.getArmyName(),
    allianceStore.getAlliance(),
    scenarioStore.getScenario()
  ])
    .then(() => fetchReports())
    .finally(() => {
      loading.value = false;
      battleReportStore.checkBattleReportSuccess();
      snackbar.value = battleReportStore.battleReportSuccess;
    });
});

function closeSnackbar() {
  snackbar.value = false;
  battleReportStore.clearBattleReportSuccess();
}
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
