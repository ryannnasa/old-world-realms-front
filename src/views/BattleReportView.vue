<template>
  <div class="background page-container">
    <v-container>
      <div class="title-wrapper">
        <v-card class="mb-4 title-container">
          <v-card-title class="text-center">{{ battleReport?.nameBattleReport }}</v-card-title>
        </v-card>
        <div class="action-buttons">
          <v-btn class="button" icon small @click="editReport">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="button" icon small @click="promptDelete">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <v-row class="battle-overview" v-if="players.length >= 2" justify="center" align="center" dense>
        <v-col
          v-for="(player, index) in players"
          :key="player.idPlayer"
          cols="12" sm="6" md="4" lg="3"
        >
          <v-card
            class="army-card"
            :class="player.isWinner ? 'winner' : 'loser'"
          >
            <div
              class="battle-image"
              :style="{ backgroundImage: `url(${getArmyImageUrl(player.armyName_idArmyName)})` }"
            />
            <v-card-text>
              <p class="army-name">{{ player.playerName }}</p>
              <p class="army-composition">{{ getArmyName(player.armyName_idArmyName) }}</p>
              <p class="alliance-name" v-if="player.alliance_idAlliance && player.alliance_idAlliance !== 4">
                Alliance : {{ getAllianceName(player.alliance_idAlliance) }}
              </p>
              <div class="score">
                <p>{{ Number(player.playerScore) ?? 0 }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mb-4 card-container description-card">
        <v-card-title>Description de la bataille</v-card-title>
        <v-card-text>
          <p class="description-text">{{ battleReport?.descriptionBattleReport }}</p>
        </v-card-text>
      </v-card>

      <v-card class="mb-4 card-container photos-card">
        <v-card-title>Photos</v-card-title>
        <v-card-text>
          <v-carousel v-model="carouselIndex">
  <v-carousel-item
    v-for="(photo, index) in battlePhotos"
    :key="index"
    :src="photo"
  />
</v-carousel>
        </v-card-text>
      </v-card>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBattleReportStore, battleReportUtils } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';

const route = useRoute();
const router = useRouter();
const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();

const battleReport = ref(null);
const players = ref([]);
const battlePhotos = ref([]);
const carouselIndex = ref(0);
const snackbar = ref(false);
const snackbarMessage = ref('');
const confirmDialog = ref(false);

const getArmyName = (armyId) => battleReportUtils.getArmyName(armyNameStore, armyId);
const getArmyImageUrl = (armyId) => battleReportUtils.getArmyImageUrl(armyPhotoStore, armyId);
const getAllianceName = (allianceId) => battleReportUtils.getAllianceName(allianceStore, allianceId);

function fetchBattlePhotos(idBattleReport) {
  return battleReportStore.fetchBattlePhotos(idBattleReport)
    .then(urls => {
      battlePhotos.value = urls;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des photos :', error);
    });
}


onMounted(() => {
  Promise.all([
    armyPhotoStore.getArmyPhoto(),
    armyNameStore.getArmyName(),
    allianceStore.getAlliance(),
    battleReportStore.getBattleReport()
  ])
    .then(() => {
      const id = parseInt(route.params.id);
      battleReport.value = battleReportStore.battleReports.find(b => b.idBattleReport === id);
      if (!battleReport.value) return;
      players.value = battleReport.value.players ?? [];
      return fetchBattlePhotos(battleReport.value.idBattleReport);
    })
    .then(() => {
      const allianceScores = {};
      const soloPlayers = [];

      const { allianceScores: calculatedAllianceScores, soloPlayers: calculatedSoloPlayers } = players.value.reduce(
        (acc, player) => {
          const allianceId = player.alliance_idAlliance;
          const playerScore = Number(player.playerScore) || 0;

          if (allianceId !== 4) {
            acc.allianceScores[allianceId] = (acc.allianceScores[allianceId] || 0) + playerScore;
          } else {
            acc.soloPlayers = [...acc.soloPlayers, { player, playerScore }];
          }
          return acc;
        },
        { allianceScores: {}, soloPlayers: [] }
      );

      const allianceEntries = Object.entries(calculatedAllianceScores);
      const maxAllianceScore = allianceEntries.length > 0 
        ? Math.max(...allianceEntries.map(([, score]) => score))
        : 0;
      const winningAllianceIds = allianceEntries
        .filter(([, score]) => score === maxAllianceScore)
        .map(([allianceId]) => Number(allianceId));
      const maxSoloScore = calculatedSoloPlayers.length > 0
        ? Math.max(...calculatedSoloPlayers.map(({ playerScore }) => playerScore))
        : 0;
      if (maxSoloScore > maxAllianceScore) {
        players.value = players.value.map(p => ({
          ...p,
          isWinner: p.alliance_idAlliance === 4 && Number(p.playerScore) === maxSoloScore
        }));
      } else if (maxSoloScore === maxAllianceScore && maxSoloScore > 0) {
        players.value = players.value.map(p => ({
          ...p,
          isWinner:
            (winningAllianceIds.includes(p.alliance_idAlliance) && p.alliance_idAlliance !== 4) ||
            (p.alliance_idAlliance === 4 && Number(p.playerScore) === maxSoloScore)
        }));
      } else {
        players.value = players.value.map(p => ({
          ...p,
          isWinner: winningAllianceIds.includes(p.alliance_idAlliance) && p.alliance_idAlliance !== 4
        }));
      }
    })
    .catch(err => {
      console.error('Erreur dans onMounted:', err);
    });
});

function editReport() {
  if (battleReport.value?.idBattleReport) {
    router.push({ name: 'Modify A New Battle Report', params: { id: battleReport.value.idBattleReport } });
  }
}

function promptDelete() {
  confirmDialog.value = true;
}

function cancelDelete() {
  confirmDialog.value = false;
}

function confirmDelete() {
  if (battleReport.value?.idBattleReport) {
    battleReportStore.deleteBattleReport(battleReport.value.idBattleReport)
      .then(() => {
        snackbarMessage.value = 'Le rapport de bataille a bien été supprimé';
        snackbar.value = true;
        setTimeout(() => {
          router.push('/allbattlereports');
        }, 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression:', err);
        snackbarMessage.value = 'Erreur lors de la suppression du rapport';
        snackbar.value = true;
      })
      .finally(() => {
        confirmDialog.value = false;
      });
  } else {
    confirmDialog.value = false;
  }
}
function closeSnackbar() {
  snackbar.value = false;
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
  padding: 20px;
}

@media (max-width: 1200px) {
  .page-container {
    margin-top: 90px;
    min-height: calc(100vh - 90px);
    padding: 15px;
  }  
  .background {
    padding: 15px;
  }
  .battle-image {
    max-width: 350px;
    height: 280px;
  }
}

@media (max-width: 959px) {
  .page-container {
    margin-top: 100px;
    min-height: calc(100vh - 100px);
    padding: 15px;
  }  
  .background {
    padding: 15px;
  }
  .battle-image {
    max-width: 300px;
    height: 250px;
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
  .action-buttons {
    right: 15px;
  }
  .title-container,
  .card-container,
  .description-card,
  .photos-card {
    border-radius: 8px;
    padding: 8px;
  }
  .title-container .v-card-title {
    font-size: 1.3rem !important;
  }
  .card-container .v-card-title,
  .description-card .v-card-title,
  .photos-card .v-card-title {
    font-size: 1.2rem !important;
  }
  .battle-overview {
    gap: 15px;
    margin-bottom: 15px;
  }
  .army-card {
    padding: 8px;
    border-radius: 8px;
  }
  .battle-image {
    max-width: 250px;
    height: 200px;
    border-radius: 8px;
  }
  .army-name {
    font-size: 16px;
  }
  .army-composition {
    font-size: 13px;
  }
  .alliance-name {
    font-size: 13px;
  }
  .score {
    font-size: 18px;
    padding: 8px;
    border-radius: 8px;
    margin-top: 8px;
  }
  .photos-card .v-carousel {
    border-radius: 8px;
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
  .battle-image {
    max-width: 200px;
    height: 160px;
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
  .action-buttons {
    right: 10px;
  }
  .title-container,
  .card-container,
  .description-card,
  .photos-card {
    border-radius: 6px;
    padding: 6px;
  }
  .title-container .v-card-title {
    font-size: 1.2rem !important;
  }
  .card-container .v-card-title,
  .description-card .v-card-title,
  .photos-card .v-card-title {
    font-size: 1.1rem !important;
  }
  .battle-overview {
    gap: 10px;
    margin-bottom: 10px;
  }
  .army-card {
    padding: 6px;
    border-radius: 6px;
  }
  .battle-image {
    max-width: 180px;
    height: 140px;
    border-radius: 6px;
    margin: 0 auto 8px;
  }
  .army-name {
    font-size: 14px;
  }
  .army-composition {
    font-size: 12px;
  }
  .alliance-name {
    font-size: 12px;
  }
  .score {
    font-size: 16px;
    padding: 6px;
    border-radius: 6px;
    margin-top: 6px;
  }
  .photos-card .v-carousel {
    border-radius: 6px;
  }
  .photos-card .v-carousel-item img {
    border-radius: 6px;
  }
}
.title-wrapper {
  text-align: center;
  display: flex;
  justify-content: center;
  position: relative;
}
.title-container,
.card-container,
.description-card,
.photos-card {
  text-align: center;
  background-color: #332018;
  color: #EBDEC2;
  padding: 10px;
  border-radius: 10px;
  position: relative;
}
.action-buttons {
  position: absolute;
  top: 0;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}
.description-text {
  white-space: pre-line;
  text-align: left;
  line-height: 1.6;
}
.button {
  background-color: #332018;
  color: #EBDEC2;
}

.battle-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;
}

.alliance-name {
  font-weight: bold;
  margin-top: 0.5em;
  color: #EBDEC2;
}

.army-card {
  background-color: #332018;
  color: #EBDEC2;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.army-card.winner {
  background-color: #3a5a2a;
}

.army-card.loser {
  background-color: #5a2a2a;
}

.battle-image {
  width: 100%;
  max-width: 400px;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin: 0 auto 10px;
}

.army-name {
  font-size: 18px;
  font-weight: bold;
}

.army-composition {
  font-size: 14px;
}

.score {
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #5e493e;
}
</style>
