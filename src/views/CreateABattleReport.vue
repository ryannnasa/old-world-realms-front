<template>
  <div class="background page-container">
    <v-container>
          <v-card class="mb-4 card-container">
            <v-card-title>Titre du Rapport</v-card-title>
            <v-card-text>
              <v-text-field v-model="battleTitle" label="Titre du rapport" outlined class="input-field" />
            </v-card-text>
          </v-card>
          <v-row>
            <v-col cols="12" md="6">
          <v-card class="mb-4 card-container">
            <v-card-title>Scénario</v-card-title>
            <v-card-text>
              <v-select
                v-model="scenario"
                :items="scenarios"
                item-title="scenarioName"
                item-value="idScenario"
                label="Choisissez un scénario"
                outlined
                class="input-field"
              />
            </v-card-text>
            
          </v-card>
          </v-col>
          <v-col cols="12" md="6">
          <v-card class="mb-4 card-container">
                        <v-card-title>Points par armée</v-card-title> 
              <v-text-field v-model="armyPoints" label="Score" type="number" outlined class="input-field" />
              </v-card>
              </v-col>
              </v-row>


      <!-- Description -->
      <v-card class="mb-4 card-container">
        <v-card-title>Description de la bataille</v-card-title>
        <v-card-text>
          <v-textarea v-model="description" label="Racontez votre bataille..." outlined class="input-field" />
          <v-file-input label="Ajouter des photos" multiple accept="image/*" />
        </v-card-text>
      </v-card>

      <!-- Résultat du Combat -->
      <v-card class="mb-4 card-container">
        <v-card-title>Résultat du combat</v-card-title>
        <v-card-text>
          <v-select
            v-model="numberOfPlayers"
            :items="playerOptions"
            label="Nombre de joueurs"
            outlined
            class="input-field"
          />

      <v-row v-for="(pair, index) in playerPairs" :key="'pair-' + index" class="mb-6">
        <v-col v-for="(player, playerIndex) in pair" :key="'player-' + player.id" cols="6">
          <p class="text-h6">Joueur {{ player.id + 1 }}</p>
          <v-text-field v-model="player.name" label="Nom du joueur" outlined class="input-field" />
          <v-select
            v-model="player.alliance"
            :items="alliances"
            item-title="allianceName"
            item-value="idAlliance"
            label="Alliance"
            outlined
            class="input-field"
          />
          <v-select
            v-model="player.army"
            :items="armiesName"
            item-title="nameArmyName"
            item-value="idArmyName"
            label="Armée"
            outlined
            class="input-field"
            @change="filterArmyCompositions(player)"
          />
          <v-select
            v-model="player.armyComposition"
            :items="getFilteredCompositions(player.army)"
            item-title="nameArmyComposition"
            item-value="idArmyComposition"
            label="Composition d'Armée"
            outlined
            class="input-field"
          />
          <v-text-field v-model="player.score" label="Score" type="number" outlined class="input-field" />

          <!-- Image dynamique pour Joueur 1 -->
 <div
  v-if="player.army"
  class="battle-image"
  :style="{ backgroundImage: `url(${getArmyImageUrl(player.army)})` }"
/>

        </v-col>
      </v-row>
        </v-card-text>
      </v-card>

      <!-- Bouton de sauvegarde -->
      <v-btn class="save-button" @click="saveBattleReport">Enregistrer le rapport</v-btn>
    </v-container>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useArmyNameStore } from '@/stores/armyName';
import { useArmyCompositionStore } from '@/stores/armyComposition';
import { useScenarioStore } from '@/stores/scenario';
import { useAllianceStore } from '@/stores/alliance';
import { useArmyStore } from '@/stores/army';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { usePlayerStore } from '@/stores/player';
import { useBattleReportStore } from '@/stores/battleReport';

// Stores
const route = useRoute();
const router = useRouter();
const reportId = route.params.id || null;

const armyCompositionStore = useArmyCompositionStore();
const armyNameStore = useArmyNameStore();
const scenarioStore = useScenarioStore();
const allianceStore = useAllianceStore();
const armyStore = useArmyStore();
const armyPhotoStore = useArmyPhotoStore();
const playerStore = usePlayerStore();
const battleReportStore = useBattleReportStore();

// Données
const battleTitle = ref('');
const description = ref('');
const scenario = ref('');
const armyPoints = ref(0);

const scenarios = computed(() => scenarioStore.scenario || []);
const armiesName = computed(() => armyNameStore.armyName || []);
const armiesComposition = computed(() => armyCompositionStore.armyComposition || []);
const alliances = computed(() => allianceStore.alliance || []);
const armyPhotos = computed(() => armyPhotoStore.armyPhoto || []);

const numberOfPlayers = ref(2);
const playerOptions = Array.from({ length: 9 }, (_, i) => i + 2);

const players = ref([
  { id: 0, name: '', alliance: '', army: '', armyComposition: '', score: 0 },
  { id: 1, name: '', alliance: '', army: '', armyComposition: '', score: 0 }
]);

// Initialisation des données des stores
armyNameStore.getArmyName();
armyCompositionStore.getArmyComposition();
scenarioStore.getScenario();
allianceStore.getAlliance();
armyStore.getArmy();
armyPhotoStore.getArmyPhoto();

// Watch pour adapter le nombre de joueurs
watch(numberOfPlayers, (newCount) => {
  const currentLength = players.value.length;
  if (newCount > currentLength) {
    for (let i = currentLength; i < newCount; i++) {
      players.value.push({
        id: i,
        name: '',
        alliance: '',
        army: '',
        armyComposition: '',
        score: 0,
      });
    }
  } else if (newCount < currentLength) {
    players.value.splice(newCount);
  }
});

// Joueurs par paire
const playerPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < players.value.length; i += 2) {
    pairs.push(players.value.slice(i, i + 2));
  }
  return pairs;
});

// Composition filtrée selon l’armée choisie
const getFilteredCompositions = (idArmyName) => {
  if (!idArmyName || !armyStore.army || !armiesComposition.value) return [];

  const uniqueCompositions = new Map();

  armyStore.army
    .filter(army => army.armyName_idArmyName === idArmyName)
    .forEach(army => {
      const comp = armiesComposition.value.find(
        comp => comp.idArmyComposition === army.armyComposition_idArmyComposition
      );
      if (comp && !uniqueCompositions.has(comp.idArmyComposition)) {
        uniqueCompositions.set(comp.idArmyComposition, comp);
      }
    });

  return Array.from(uniqueCompositions.values());
};

// Image dynamique
const getArmyImageUrl = (armyId) => {
  const photo = armyPhotos.value.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png';
};

// Chargement du rapport existant si un ID est présent
const loadBattleReport = async (id) => {
  try {
    const report = await battleReportStore.fetchBattleReportById(id);
    battleTitle.value = report.nameBattleReport;
    description.value = report.descriptionBattleReport;
    scenario.value = report.scenario_idScenario;
    armyPoints.value = report.armyPoints;

    if (report.players?.length) {
      numberOfPlayers.value = report.players.length;
      players.value = report.players.map((p, index) => ({
        id: index,
        name: p.playerName,
        score: Number(p.playerScore),
        alliance: p.alliance_idAlliance,
        army: p.armyName_idArmyName,
        armyComposition: p.armyComposition_idArmyComposition
      }));
    }
  } catch (error) {
    console.error('Erreur lors du chargement du rapport :', error);
  }
};

// Sauvegarde (création ou mise à jour)
const saveBattleReport = () => {
  const reportToSend = {
    nameBattleReport: battleTitle.value,
    descriptionBattleReport: description.value,
    scenario_idScenario: scenario.value,
    battleReportPhoto_idBattleReportPhoto: 1,
    armyPoints: armyPoints.value,
    players: players.value.map(p => ({
      playerName: p.name || null,
      playerScore: p.score != null ? String(p.score) : null,
      alliance_idAlliance: p.alliance ?? null,
      armyName_idArmyName: p.army ?? null,
      armyComposition_idArmyComposition: p.armyComposition ?? null,
    }))
  };

  const action = reportId
    ? battleReportStore.updateBattleReport(reportId, reportToSend)
    : battleReportStore.addBattleReport(reportToSend);

  action
    .then(() => router.push('/AllBattleReports'))
    .catch(err => {
      console.error('Erreur lors de la sauvegarde :', err);
      alert('Une erreur est survenue. Vérifiez la console.');
    });
};

// Chargement initial si édition
onMounted(() => {
  if (reportId) {
    loadBattleReport(reportId);
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

.save-button {
  background-color: #332018;
  color: #EBDEC2;
}

.input-field {
  color: #EBDEC2;
}

.battle-image {
  width: 50%;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin: 20px auto 0 auto;
}

</style>
