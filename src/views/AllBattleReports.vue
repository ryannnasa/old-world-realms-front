<template>
  <div class="background page-container">
    <v-container>

      <div class="button-container">
        <v-btn text to="/createabattlereport" class="mb-4 button">
          <v-icon left>mdi-plus</v-icon>
          Créer un nouveau rapport
        </v-btn>
      </div>

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
              <div class="chip-container">
                <v-chip @click="selectedPoints=500">500</v-chip>
                <v-chip @click="selectedPoints=1000">1000</v-chip>
                <v-chip @click="selectedPoints=1500">1500</v-chip>
                <v-chip @click="selectedPoints=2000">2000</v-chip>
                <v-chip @click="selectedPoints=3000">3000</v-chip>
              </div>
            </v-col>
          </v-row>

          <v-btn text class="reset-button" @click="resetFilters">
            Réinitialiser les filtres
          </v-btn>
        </v-card-text>
      </v-card>

      <v-row>
        <v-col
          v-for="report in filteredReports"
          :key="report.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="card-container battle-card" hover>
            <div class="action-buttons">
              <v-btn class="button" icon small @click.stop="editReport(report.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn class="button" icon small @click.stop="promptDelete(report.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>

            <router-link :to="`/battlereportview/${report.id}`" style="text-decoration: none; color: inherit;">
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
                    ></div>
                  </div>
                </template>
              </div>

              <v-card-title class="mt-2">{{ report.title }}</v-card-title>

              <v-card-subtitle class="d-flex align-center justify-center flex-wrap text-center">
                <template v-for="(alliance, index) in groupedByAlliance(report.players)" :key="index">
                  <span class="mx-1 font-weight-medium">
                    {{ alliance.map(player => player.name).join(' / ') }}
                  </span>
                  <v-icon
                    v-if="index < groupedByAlliance(report.players).length - 1"
                    class="mx-2"
                    color="grey"
                  >
                    mdi-sword-cross
                  </v-icon>
                </template>
              </v-card-subtitle>

              <v-card-text>{{ report.points }} points</v-card-text>
            </router-link>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar" :timeout="5000" location="bottom right" color="success">
  {{ snackbarMessage }}
  <template v-slot:actions>
    <v-btn color="white" variant="text" @click="closeSnackbar">Fermer</v-btn>
  </template>
</v-snackbar>

  </div>

  <v-dialog v-model="confirmDialog" max-width="500">
  <v-card class="card-container">
    <v-card-title class="text-h6">Confirmation de suppression</v-card-title>
    <v-card-text>Êtes-vous sûr de vouloir supprimer ce rapport de bataille ?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="cancelDelete">Annuler</v-btn>
      <v-btn color="error" text @click="confirmDelete">Supprimer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // import router
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';
import _ from 'lodash';

const router = useRouter();
const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();
const scenarioStore = useScenarioStore();
const reports = ref([]);
const snackbar = ref(false);
const snackbarMessage = ref('');
const confirmDialog = ref(false);
const idToDelete = ref(null);
const factions = computed(() => armyNameStore.armyName.map(a => a.nameArmyName));
const opponents = factions;
const scenarios = computed(() => scenarioStore.scenario.map(s => s.scenarioName));
const selectedFaction = ref('');
const selectedOpponent = ref('');
const selectedScenario = ref('');
const selectedPoints = ref(null);
const NoAlliance = 4;

function resetFilters() {
  selectedFaction.value = '';
  selectedOpponent.value = '';
  selectedScenario.value = '';
  selectedPoints.value = null;
}

function promptDelete(id) {
  idToDelete.value = id;
  confirmDialog.value = true;
}

function cancelDelete() {
  confirmDialog.value = false;
  idToDelete.value = null;
}

function confirmDelete() {
  if (idToDelete.value !== null) {
    battleReportStore.deleteBattleReport(idToDelete.value)
      .then(() => fetchReports())
      .then(() => {
        snackbarMessage.value = 'Le rapport de bataille a bien été supprimé';
        snackbar.value = true;
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        confirmDialog.value = false;
        idToDelete.value = null;
      });
  } else {
    confirmDialog.value = false;
    idToDelete.value = null;
  }
}


const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const firstPlayer = report.players[0];
    if (!firstPlayer) return false;

    const firstAllianceId = firstPlayer.allianceId;
    const isFirstPlayerAlone = !firstAllianceId || firstAllianceId === NoAlliance;

    const enemyPlayers = report.players.filter(p => {
      if (p.name === firstPlayer.name) return false;
      if (isFirstPlayerAlone) {
        return p.allianceId === NoAlliance && p.allianceId !== undefined;
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

  const groupedObj = _.groupBy(players, player => {
    if (!player.allianceId || player.allianceId === NoAlliance) {
      return `no-alliance-${player.name}`;
    }
    return player.allianceId;
  });

  const groups = Object.values(groupedObj);

  const firstPlayer = players[0];
  const firstGroupKey = (!firstPlayer.allianceId || firstPlayer.allianceId === NoAlliance)
    ? `no-alliance-${firstPlayer.name}`
    : firstPlayer.allianceId;

  const sortedGroups = [];

  if (groupedObj[firstGroupKey]) {
    sortedGroups.push(groupedObj[firstGroupKey]);
    delete groupedObj[firstGroupKey];
  }
  for (const group of Object.values(groupedObj)) {
    sortedGroups.push(group);
  }

  return sortedGroups;
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

function fetchReports() {
  return armyPhotoStore.getArmyPhoto()
    .then(() => armyNameStore.getArmyName())
    .then(() => allianceStore.getAlliance())
    .then(() => battleReportStore.getBattleReport())
    .then(() => {
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
          points: Number(report.armyPoints),
          faction: players[0]?.army || '',
          opponent: players[1]?.army || '',
          players
        };
      });
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
      battleReportStore.checkBattleReportSuccess();
if (battleReportStore.battleReportSuccess) {
  switch (battleReportStore.battleReportAction) {
    case 'created':
      snackbarMessage.value = 'Le rapport de bataille a bien été créé';
      break;
    case 'updated':
      snackbarMessage.value = 'Le rapport de bataille a bien été modifié';
      break;
    case 'deleted':
      snackbarMessage.value = 'Le rapport de bataille a bien été supprimé';
      break;
    default:
      snackbarMessage.value = 'Le rapport de bataille a bien été enregistré';
  }
  snackbar.value = true;
  battleReportStore.clearBattleReportSuccess();
}

    });
});

function closeSnackbar() {
  snackbar.value = false;
  battleReportStore.clearBattleReportSuccess();
}

// Fonctions ajoutées pour gérer les boutons

function editReport(id) {
  router.push({ name: 'Modify A New Battle Report', params: { id } });
}

function deleteReport(id) {
  battleReportStore.deleteBattleReport(id)
    .then(() => {
      return fetchReports();
    })
    .then(() => {
      snackbar.value = true;
    })
    .catch(err => {
      console.error('Erreur lors de la suppression:', err);
    });
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
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.battle-card:hover {
  transform: scale(1.02);
  image-rendering: auto;
}

.action-buttons {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  gap: 4px;
  z-index: 2;
}

.battle-card:hover .action-buttons {
  display: flex;
}

.battle-images-container {
  position: relative;
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.battle-image {
  flex: 1;
  background-size: cover;
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
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.player-image {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  margin: 0 2px;
}

.battle-image.single-army {
  flex: 2;
}

.battle-images-container {
  position: relative;
  width: 100%;
  height: 200px;
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

.chip-container {
  display: flex;
  justify-content: space-evenly;

}
</style>
