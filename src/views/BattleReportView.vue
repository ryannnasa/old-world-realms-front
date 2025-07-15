<template>
  <div class="background page-container">
    <v-container>
      <div class="title-wrapper">
        <v-card class="mb-4 title-container">
          <v-card-title class="text-center">{{ battleReport?.nameBattleReport }}</v-card-title>
        </v-card>
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
              <p class="alliance-name" v-if="player.alliance_idAlliance">
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
          <p>{{ battleReport?.descriptionBattleReport }}</p>
        </v-card-text>
      </v-card>

      <v-card class="mb-4 card-container photos-card">
        <v-card-title>Photos</v-card-title>
        <v-card-text>
          <v-carousel>
            <v-carousel-item
              v-for="(photo, index) in battlePhotos"
              :key="index"
              :src="photo"
            />
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';

const route = useRoute();
const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();

const battleReport = ref(null);
const players = ref([]);
const battlePhotos = ref([]);

// Nom lisible de l'armée depuis l'id
function getArmyName(armyId) {
  const army = armyNameStore.armyName.find(a => a.idArmyName === armyId);
  return army ? army.nameArmyName : 'Inconnu';
}

// Image d'armée depuis l'id
function getArmyImageUrl(armyId) {
  const photo = armyPhotoStore.armyPhoto.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/default.jpg';
}

// Nom de l'alliance depuis l'id
function getAllianceName(allianceId) {
  const alliance = allianceStore.alliance.find(a => a.idAlliance === allianceId);
  return alliance ? alliance.allianceName : 'Inconnue';
}

onMounted(() => {
  Promise.all([
    armyPhotoStore.getArmyPhoto(),
    armyNameStore.getArmyName(),
    allianceStore.getAlliance(),
    battleReportStore.getBattleReport()
  ]).then(() => {
    const id = parseInt(route.params.id);
    battleReport.value = battleReportStore.battleReports.find(b => b.idBattleReport === id);

    if (battleReport.value) {
      players.value = battleReport.value.players ?? [];
      const allianceScores = {};
      const soloPlayers = [];

      players.value.forEach(player => {
        const allianceId = player.alliance_idAlliance;
        const playerScore = Number(player.playerScore) || 0;

        if (allianceId !== 4) {
          allianceScores[allianceId] = (allianceScores[allianceId] || 0) + playerScore;
        } else {
          soloPlayers.push({ player, playerScore });
        }
      });

      let maxAllianceScore = 0;
      let winningAllianceIds = [];

      Object.entries(allianceScores).forEach(([allianceId, totalScore]) => {
        if (totalScore > maxAllianceScore) {
          maxAllianceScore = totalScore;
          winningAllianceIds = [Number(allianceId)];
        } else if (totalScore === maxAllianceScore) {
          winningAllianceIds.push(Number(allianceId));
        }
      });

      let maxSoloScore = 0;
      soloPlayers.forEach(({ playerScore }) => {
        if (playerScore > maxSoloScore) {
          maxSoloScore = playerScore;
        }
      });

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

      battlePhotos.value = [
        '/img/Bretonniens/BREChevaliersDuGraal01.jpg',
        '/img/Bretonniens/BREChevaliersDuGraal02.jpg',
      ];
    }
  }).catch(err => {
    console.error('Erreur dans onMounted:', err);
  });
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

.title-wrapper {
  text-align: center;
  display: flex;
  justify-content: center;
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
  color: #EBDEC2; /* couleur pour bien distinguer l'alliance */
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
  background-color: #3a5a2a; /* Vert clair */
}

.army-card.loser {
  background-color: #5a2a2a; /* Rouge clair */
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
