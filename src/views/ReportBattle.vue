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
              <v-select v-model="selectedScenario" :items="scenarios" label="Choisissez un scénario" outlined class="input-field" />
              <v-text-field v-if="selectedScenario === 'Autre'" v-model="customScenario" label="Nom du scénario" outlined class="input-field" />
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

          <v-row v-for="(pair, index) in playerPairs" :key="index" class="mb-6">
            <v-col v-for="player in pair" :key="player.id" cols="6">
              <p class="text-h6">Joueur {{ player.id + 1 }}</p>
              <v-text-field v-model="player.name" label="Nom du joueur" outlined class="input-field" />
              <v-select v-model="player.alliance" :items="alliances" label="Alliance" outlined class="input-field" />
              <v-select
                v-model="player.army"
                :items="armies"
                item-title="nomArmee"
                item-value="idNomArmee"
                label="Armée"
                outlined
                class="input-field"
              />
              <v-select
                v-model="player.composition"
                :items="armyCompositions"
                item-title="nomCompositionArmee"
                item-value="idCompositionArmee"
                label="Composition d'Armée"
                outlined
                class="input-field"
              />
              <v-text-field v-model="player.score" label="Score" type="number" outlined class="input-field" />

              <!-- Image dynamique pour Joueur 1 -->
              <div
                v-if="player.army"
                class="battle-image"
                :style="{ backgroundImage: 'url(/img/armees/tow-skaven.png)' }"
              ></div>
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
import { useArmeeStore } from '@/stores/armee';
import { ref, onMounted, watch, computed } from 'vue';
const armeeStore = useArmeeStore()
armeeStore.getArmee()
const battleTitle = ref('');
const description = ref('');
const selectedScenario = ref('');
const customScenario = ref('');
const scenarios = ref(['Bataille Ouverte', 'Scénario Officiel', 'Autre']);
const armies = computed(()=>{return armeeStore.armee});
const armyCompositions = ref([]);
const alliances = ['Ordre', 'Chaos', 'Destruction', 'Aucune'];

const numberOfPlayers = ref(2);
const playerOptions = Array.from({ length: 9 }, (_, i) => i + 2);

const players = ref([
  { id: 0, name: '', alliance: '', army: '', composition: '', score: 0 },
  { id: 1, name: '', alliance: '', army: '', composition: '', score: 0 }
]);

watch(numberOfPlayers, (newVal) => {
  const parsed = parseInt(newVal);
  if (parsed >= 2) {
    while (players.value.length < parsed) {
      players.value.push({
        id: players.value.length,
        name: '',
        alliance: '',
        army: '',
        composition: '',
        score: 0,
      });
    }
    while (players.value.length > parsed) {
      players.value.pop();
    }
  }
});

const playerPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < players.value.length; i += 2) {
    pairs.push(players.value.slice(i, i + 2));
  }
  return pairs;
});


function fetchArmyCompositions() {
  fetch('http://localhost:8080/compositionarmee')
    .then(res => res.json())
    .then(data => armyCompositions.value = data)
    .catch(err => console.error("Erreur API : ", err));
}

const saveBattleReport = () => {
  const battleReport = {
    title: battleTitle.value,
    description: description.value,
    players: players.value,
    scenario: selectedScenario.value === 'Autre' ? customScenario.value : selectedScenario.value,
  };
  console.log("Rapport enregistré:", battleReport);
  alert("Rapport enregistré avec succès !");
};

onMounted(() => {
  fetchArmyCompositions();
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
