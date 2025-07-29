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
        <v-card-title class="filter-title" @click="toggleFilters">
          Filtres
          <v-spacer></v-spacer>
          <v-btn icon class="filter-toggle-btn" @click.stop="toggleFilters">
            <v-icon>{{ showFilters ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-show="showFilters || !isMobile" class="filter-content">
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
                <v-chip class="points-chip" @click="selectedPoints=500">500</v-chip>
                <v-chip class="points-chip" @click="selectedPoints=1000">1000</v-chip>
                <v-chip class="points-chip" @click="selectedPoints=1500">1500</v-chip>
                <v-chip class="points-chip" @click="selectedPoints=2000">2000</v-chip>
                <v-chip class="points-chip d-none d-lg-inline-flex" @click="selectedPoints=3000">3000</v-chip>
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
                    v-for="(alliance, index) in report.groupedAlliances"
                    :key="index"
                    class="battle-image alliance-group"
                    :class="{ 'single-army': alliance.singleArmy }"
                    :style="{ width: 100 / report.groupedAlliances.length + '%' }"
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
                <template v-for="(alliance, index) in report.groupedAlliances" :key="index">
                  <span class="mx-1 font-weight-medium">
                    {{ alliance.map(player => player.name).join(' / ') }}
                  </span>
                  <v-icon
                    v-if="index < report.groupedAlliances.length - 1"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBattleReportStore, battleReportUtils } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';
import { useAuthStore } from '@/stores/auth';
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
const authStore = useAuthStore();
const showFilters = ref(false);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 960;
  if (!isMobile.value) {
    showFilters.value = true;
  } else {
    showFilters.value = false;
  }
};

const toggleFilters = () => {
  if (isMobile.value) {
    showFilters.value = !showFilters.value;
    console.log('Toggle filters:', showFilters.value, 'isMobile:', isMobile.value);
  }
};

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

function fetchReports() {
  return armyPhotoStore.getArmyPhoto()
    .then(() => armyNameStore.getArmyName())
    .then(() => allianceStore.getAlliance())
    .then(() => battleReportStore.fetchBattleReportByUserId(authStore.profile.id))
    .then(() => {
      reports.value = battleReportStore.battleReports.map(report => {
        const players = report.players?.map(p => ({
          name: p.playerName,
          allianceId: p.alliance_idAlliance,
          alliance: battleReportUtils.getAllianceName(allianceStore, p.alliance_idAlliance),
          army: battleReportUtils.getArmyName(armyNameStore, p.armyName_idArmyName),
          armyImage: battleReportUtils.getArmyImageUrl(armyPhotoStore, p.armyName_idArmyName),
          score: p.playerScore
        })) ?? [];

        const groupedAlliances = battleReportUtils.groupedByAlliance(players, NoAlliance);

        return {
          id: report.idBattleReport,
          title: report.nameBattleReport,
          description: report.descriptionBattleReport,
          scenario: battleReportUtils.getScenarioName(scenarioStore, report.scenario_idScenario),
          points: Number(report.armyPoints),
          faction: players[0]?.army || '',
          opponent: players[1]?.army || '',
          players,
          groupedAlliances
        };
      });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des rapports de bataille :', err);
    });
}

const loading = ref(true);

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  
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

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

function closeSnackbar() {
  snackbar.value = false;
  battleReportStore.clearBattleReportSuccess();
}

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
  background-color: rgba(33, 21, 16, 0.9);
  min-height: calc(100vh - 80px);
  padding: 20px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .page-container {
    margin-top: 90px;
    min-height: calc(100vh - 90px);
    padding: 15px;
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .page-container {
    margin-top: 100px;
    min-height: calc(100vh - 100px);
    padding: 15px;
  }
  
  .background {
    padding: 15px;
  }
  .v-row:last-child {
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .v-row:last-child .v-col {
    max-width: 330px;
  }
  .battle-images-container {
    height: 165px !important;
  }
}

@media (max-width: 768px) {
  .page-container {
    margin-top: 110px;
    min-height: calc(100vh - 110px);
    padding: 10px;
  } 
  .background {
    padding: 10px;
  }  
  .button-container {
    margin-bottom: 15px;
  }
  .v-row:last-child {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }  
  .v-row:last-child .v-col {
    max-width: 100%;
  }
  .battle-images-container {
    height: 160px !important;
  }
}

@media (max-width: 600px) {
  .page-container {
    margin-top: 120px;
    min-height: calc(100vh - 120px);
    padding: 8px;
  }
  
  .background {
    padding: 8px;
  }
  .v-row:last-child {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }
  .battle-images-container {
    height: 160px !important;
  }
  .v-card-title {
    font-size: 1.1rem !important;
    padding: 10px 12px !important;
  }  
  .v-card-subtitle {
    font-size: 0.9rem !important;
    padding: 6px 12px !important;
  }  
  .v-card-text {
    padding: 6px 12px 10px 12px !important;
  }  
  .chip-container {
    flex-wrap: nowrap;
    gap: 2px;
    justify-content: flex-start;
  } 
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 42px !important;
    max-width: 42px !important;
    flex: none !important;
    padding: 0 2px !important;
    border-radius: 12px !important;
  } 
  .points-chip .v-chip__content {
    font-size: 10px !important;
    line-height: 24px !important;
  }
}

@media (max-width: 480px) {
  .page-container {
    margin-top: 130px;
    min-height: calc(100vh - 130px);
    padding: 5px;
  }  
  .background {
    padding: 5px;
  }
  .v-row:last-child {
    max-width: 380px;
    margin-left: auto;
    margin-right: auto;
  }
  .battle-images-container {
    height: 140px !important;
  }
  .v-card-title {
    font-size: 0.95rem !important;
    padding: 6px 8px !important;
    line-height: 1.2 !important;
  }  
  .v-card-subtitle {
    font-size: 0.8rem !important;
    padding: 3px 8px !important;
    line-height: 1.1 !important;
  } 
  .v-card-text {
    padding: 3px 8px 6px 8px !important;
    font-size: 0.85rem !important;
  }  
  .chip-container {
    gap: 1px !important;
    justify-content: flex-start !important;
  } 
  .points-chip {
    font-size: 8px !important;
    height: 20px !important;
    min-width: 36px !important;
    max-width: 36px !important;
    flex: none !important;
    padding: 0 1px !important;
    border-radius: 10px !important;
  }  
  .points-chip .v-chip__content {
    font-size: 8px !important;
    line-height: 20px !important;
    padding: 0 !important;
  }
}
.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}
.filter-title {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px 20px !important;
}
.filter-toggle-btn {
  display: none;
}
.filter-content {
  transition: all 0.3s ease-in-out;
}

@media (max-width: 960px) {
  .filter-title {
    user-select: none;
  }  
  .filter-toggle-btn {
    display: inline-flex !important;
  }  
  .filter-content {
    overflow: hidden;
  }  

  @media (min-width: 601px) {
    .points-chip {
      border-radius: 16px !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      letter-spacing: 0.5px !important;
    }    
    .points-chip .v-chip__content {
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 100% !important;
    }
  }
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

@media (min-width: 769px) {
  .battle-images-container {
    height: 200px;
  }
}
.battle-images-container {
  position: relative;
  width: 100%;
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
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

@media (min-width: 960px) {
  .points-chip {
    flex: 1;
    min-width: 90px;
    font-size: 20px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 0 14px !important;
  }
}
.points-chip {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
}

@media (min-width: 1351px) {
  .points-chip {
    flex: none !important;
    min-width: 48px !important;
    max-width: 53px !important;
    font-size: 12px !important;
    height: 28px !important;
    padding: 0 4px !important;
  }  
  .chip-container {
    gap: 3px;
    justify-content: flex-start;
  }
}

@media (max-width: 1350px) {
  .points-chip {
    font-size: 12px !important;
    height: 28px !important;
    min-width: 45px !important;
    max-width: 50px !important;
    flex: none !important;
    padding: 0 4px !important;
  }  
  .chip-container {
    gap: 3px;
    justify-content: flex-start;
  }
}

@media (max-width: 1200px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 38px !important;
    max-width: 43px !important;
    flex: none !important;
    padding: 0 3px !important;
  }  
  .chip-container {
    gap: 2px;
    justify-content: flex-start;
  }
}

@media (min-width: 1200px) and (max-width: 1280px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 36px !important;
    max-width: 40px !important;
    flex: none !important;
    padding: 0 2px !important;
  }  
  .chip-container {
    gap: 1px;
    justify-content: flex-start;
  }
}

@media (min-width: 960px) and (max-width: 1199px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 37px !important;
    max-width: 42px !important;
    flex: none !important;
    padding: 0 3px !important;
  }  
  .chip-container {
    gap: 2px;
    justify-content: flex-start;
  }
}

@media (max-width: 959px) {
  .points-chip {
    font-size: 16px !important;
    height: 36px !important;
    min-width: 80px !important;
    max-width: 80px !important;
    flex: none !important;
    padding: 0 8px !important;
    border-radius: 18px !important;
  }  
  .points-chip .v-chip__content {
    font-size: 16px !important;
    line-height: 36px !important;
  } 
  .chip-container {
    gap: 8px;
    justify-content: flex-start;
  }
}


@media (max-width: 480px) {
  .chip-container {
    gap: 3px !important;
    justify-content: flex-start !important;
  }  
  .points-chip {
    font-size: 12px !important;
    height: 28px !important;
    min-width: 45px !important;
    max-width: 45px !important;
    flex: none !important;
    padding: 0 3px !important;
    border-radius: 14px !important;
  }  
  .points-chip .v-chip__content {
    font-size: 12px !important;
    line-height: 28px !important;
    padding: 0 !important;
  }
}
</style>
