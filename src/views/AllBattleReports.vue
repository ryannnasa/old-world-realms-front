<template>
  <div class="background page-container">
    <v-container>

      <div class="button-container">
        <v-btn text to="/createabattlereport" class="mb-4 button">
          <v-icon left>mdi-plus</v-icon>
          Créer un nouveau rapport
        </v-btn>
      </div>

      <BattleReportFilters
        :factions="factions"
        :opponents="opponents"
        :scenarios="scenarios"
        :selected-faction="selectedFaction"
        :selected-opponent="selectedOpponent"
        :selected-scenario="selectedScenario"
        :selected-points="selectedPoints"
        @update:selected-faction="selectedFaction = $event"
        @update:selected-opponent="selectedOpponent = $event"
        @update:selected-scenario="selectedScenario = $event"
        @update:selected-points="selectedPoints = $event"
        @reset-filters="resetFilters"
      />

      <BattleReportCards 
        :reports="filteredReports" 
        @edit-report="editReport"
        @delete-report="promptDelete"
      />
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
import { useRouter } from 'vue-router';
import { useBattleReportStore, battleReportUtils } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';
import { useAuthStore } from '@/stores/auth';
import BattleReportCards from '@/components/BattleReportCards.vue';
import BattleReportFilters from '@/components/BattleReportFilters.vue';
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
.button {
  background-color: #332018;
  color: #EBDEC2;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
