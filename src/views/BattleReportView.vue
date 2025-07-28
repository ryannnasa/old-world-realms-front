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
const carouselIndex = ref(0);

// Fonction pour récupérer le nom lisible de l'armée depuis l'ID
function getArmyName(armyId) {
  const army = armyNameStore.armyName.find(a => a.idArmyName === armyId);
  return army ? army.nameArmyName : 'Inconnu';
}

// Fonction pour récupérer l'URL de l'image de l'armée depuis l'ID
function getArmyImageUrl(armyId) {
  const photo = armyPhotoStore.armyPhoto.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/default.jpg';
}

// Fonction pour récupérer le nom de l'alliance depuis l'ID
function getAllianceName(allianceId) {
  const alliance = allianceStore.alliance.find(a => a.idAlliance === allianceId);
  return alliance ? alliance.allianceName : 'Inconnue';
}

// Fonction pour construire l'URL publique Scaleway d'une photo
function getPhotoUrl(filename) {
  return fetch(`http://localhost:8080/image-url/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error('Erreur lors de la récupération du lien signé');
      return response.text();
    })
    .catch(err => {
      console.error('Erreur pour getPhotoUrl:', err);
      return '/img/erreur.jpg'; // image fallback si erreur
    });
}

function fetchBattlePhotos(idBattleReport) {
  return fetch(`http://localhost:8080/battlereport/${idBattleReport}/photos`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then(data => {
      return Promise.all(data.map(photo => getPhotoUrl(photo.nameBattleReportPhoto)));
    })
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

      // Appel des photos dynamiques
      return fetchBattlePhotos(battleReport.value.idBattleReport);
    })
    .then(() => {
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
    })
    .catch(err => {
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
  padding: 20px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .page-container {
    margin-top: 90px;
    min-height: calc(100vh - 90px);
    padding: 15px;
  }
  
  .background {
    padding: 15px;
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

/* Responsive pour les cartes */
@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
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
}

.battle-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;
}

/* Responsive pour l'aperçu de bataille */
@media (max-width: 768px) {
  .battle-overview {
    gap: 15px;
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .battle-overview {
    gap: 10px;
    margin-bottom: 10px;
  }
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

/* Responsive pour les cartes d'armée */
@media (max-width: 768px) {
  .army-card {
    padding: 8px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .army-card {
    padding: 6px;
    border-radius: 6px;
  }
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

/* Responsive pour les images de bataille */
@media (max-width: 1200px) {
  .battle-image {
    max-width: 350px;
    height: 280px;
  }
}

@media (max-width: 959px) {
  .battle-image {
    max-width: 300px;
    height: 250px;
  }
}

@media (max-width: 768px) {
  .battle-image {
    max-width: 250px;
    height: 200px;
    border-radius: 8px;
  }
}

@media (max-width: 600px) {
  .battle-image {
    max-width: 200px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .battle-image {
    max-width: 180px;
    height: 140px;
    border-radius: 6px;
    margin: 0 auto 8px;
  }
}

.army-name {
  font-size: 18px;
  font-weight: bold;
}

.army-composition {
  font-size: 14px;
}

/* Responsive pour les textes des armées */
@media (max-width: 768px) {
  .army-name {
    font-size: 16px;
  }
  
  .army-composition {
    font-size: 13px;
  }
  
  .alliance-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .army-name {
    font-size: 14px;
  }
  
  .army-composition {
    font-size: 12px;
  }
  
  .alliance-name {
    font-size: 12px;
  }
}

.score {
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #5e493e;
}

/* Responsive pour les scores */
@media (max-width: 768px) {
  .score {
    font-size: 18px;
    padding: 8px;
    border-radius: 8px;
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .score {
    font-size: 16px;
    padding: 6px;
    border-radius: 6px;
    margin-top: 6px;
  }
}

/* Responsive pour le carrousel de photos */
@media (max-width: 768px) {
  .photos-card .v-carousel {
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .photos-card .v-carousel {
    border-radius: 6px;
  }
  
  .photos-card .v-carousel-item img {
    border-radius: 6px;
  }
}
</style>
