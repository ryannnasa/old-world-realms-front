<template>
  <div class="background page-container">
    <v-container>
      <v-row>
        <!-- Titre -->
        <v-col cols="12" md="6">
          <v-card class="mb-4 card-container">
            <v-card-title>Titre du Rapport</v-card-title>
            <v-card-text>
              <v-text-field v-model="battleTitle" label="Titre du rapport" outlined class="input-field" />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Scénario -->
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
import { useArmyNameStore } from '@/stores/armyName';
import { useArmyCompositionStore } from '@/stores/armyComposition';
import { useScenarioStore } from '@/stores/scenario';
import { useAllianceStore } from '@/stores/alliance';
import { useArmyStore } from '@/stores/army';
import { useArmyPhotoStore } from '@/stores/armyPhoto'
import { usePlayerStore } from '@/stores/player';
import { useBattleReportStore } from '@/stores/battleReport';
import { ref, computed, onMounted, watch } from 'vue';

const armyCompositionStore = useArmyCompositionStore();
const armyNameStore = useArmyNameStore();
const scenarioStore = useScenarioStore();
const allianceStore = useAllianceStore();
const armyStore = useArmyStore();
const armyPhotoStore = useArmyPhotoStore()
const playerStore = usePlayerStore()
const battleReportStore = useBattleReportStore()

armyNameStore.getArmyName();
armyCompositionStore.getArmyComposition();
scenarioStore.getScenario();
allianceStore.getAlliance();
armyStore.getArmy();
armyPhotoStore.getArmyPhoto()

const battleTitle = ref('');
const description = ref('');
const scenario = ref('');
const scenarios = computed(() => scenarioStore.scenario || []);
const armiesName = computed(() => armyNameStore.armyName || []);
const armiesComposition = computed(() => armyCompositionStore.armyComposition || []);
const alliances = computed(() => allianceStore.alliance || []);
const armyPhotos = computed(() => armyPhotoStore.armyPhoto || [])

const numberOfPlayers = ref(2);
const playerOptions = Array.from({ length: 9 }, (_, i) => i + 2);

const players = ref([
  { id: 0, name: '', alliance: '', army: '', armyComposition: '', score: 0 },
  { id: 1, name: '', alliance: '', army: '', armyComposition: '', score: 0 }
]);

watch(numberOfPlayers, (newCount) => {
  const currentLength = players.value.length
  if (newCount > currentLength) {
    for (let i = currentLength; i < newCount; i++) {
      players.value.push({
        id: i,
        name: '',
        alliance: '',
        army: '',
        armyComposition: '',
        score: 0,
      })
    }
  } else if (newCount < currentLength) {
    players.value.splice(newCount)
  }
})


const playerPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < players.value.length; i += 2) {
    pairs.push(players.value.slice(i, i + 2));
  }
  return pairs;
});

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

const getArmyImageUrl = (armyId) => {
  const photo = armyPhotos.value.find(p => p.armyName_idArmyName === armyId)
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png'
}

const saveBattleReport = async () => {
  try {
    const createdPlayerIds = [];

    console.log('Joueurs avant envoi :', players.value);

    for (const p of players.value) {
      const playerToSave = {
        playerName: p.name,
        playerScore: String(p.score),
        alliance_idAlliance: typeof p.alliance === 'object' ? p.alliance.idAlliance : p.alliance,
        armyName_idArmyName: typeof p.army === 'object' ? p.army.idArmyName : p.army,
        armyComposition_idArmyComposition: typeof p.armyComposition === 'object' ? p.armyComposition.idArmyComposition : p.armyComposition,
      };

        const response = await playerStore.addPlayer(playerToSave);
        const id = response.idPlayer;

      createdPlayerIds.push({
        idPlayer: id,
        alliance: playerToSave.alliance_idAlliance,
        army: playerToSave.armyName_idArmyName,
        armyComposition: playerToSave.armyComposition_idArmyComposition
      });
    }

    const firstPlayer = createdPlayerIds[0];

    const reportToSend = {
      nameBattleReport: battleTitle.value,
      descriptionBattleReport: description.value,
      player_idPlayer: firstPlayer.idPlayer,
      player_alliance_idAlliance: firstPlayer.alliance,
      player_armyName_idArmyName: firstPlayer.army,
      player_armyComposition_idArmyComposition: firstPlayer.armyComposition,
      scenario_idScenario: scenario.value,
      battleReportPhoto_idBattleReportPhoto: 1
    };

    console.log('Rapport à envoyer :', reportToSend);

    await battleReportStore.addBattleReport(reportToSend);

    alert('Rapport enregistré avec succès !');
  } catch (err) {
    console.error('Erreur lors de la sauvegarde :', err);
    alert('Une erreur est survenue. Vérifiez la console.');
  }
};


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
