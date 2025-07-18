<template>
  <div class="background page-container">
    <v-container>

      <!-- Titre du rapport -->
      <v-card class="mb-4 card-container">
        <v-card-title>Titre du Rapport</v-card-title>
        <v-card-text>
          <v-text-field v-model="battleTitle" label="Titre du rapport" outlined class="input-field" />
        </v-card-text>
      </v-card>

      <!-- Scénario et points -->
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
            <v-card-text>
              <v-text-field v-model="armyPoints" label="Score" type="number" outlined class="input-field" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Description -->
      <v-card class="mb-4 card-container">
        <v-card-title>Description de la bataille</v-card-title>
        <v-card-text>
          <v-textarea v-model="description" label="Racontez votre bataille..." outlined class="input-field" />
          <!-- Photos -->
<v-card class="mb-4 card-container">
  <v-card-title>Photos de la bataille</v-card-title>
  <v-card-text>
    <div class="photo-grid">
      <!-- Miniatures existantes -->
      <div
        v-for="(photo, index) in photoPreviews"
        :key="index"
        class="photo-thumbnail"
      >
        <v-img :src="photo" aspect-ratio="1" cover />
        <v-btn icon class="remove-btn" @click="removePhoto(index)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Case pour ajouter une nouvelle photo -->
      <div v-if="photos.length < 10" class="photo-add" @click="triggerFileInput">
        <v-icon size="36">mdi-plus</v-icon>
      </div>

      <!-- Input caché pour déclencher le sélecteur -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="d-none"
        @change="handleFileChange"
      />
    </div>
    <p class="text-caption mt-2">Maximum : 10 photos</p>
  </v-card-text>
</v-card>

        </v-card-text>
      </v-card>

      <!-- Résultat du combat -->
<v-card class="mb-4 card-container">
  <v-card-title>Résultat du combat</v-card-title>
  <v-card-text>

    <!-- Paires de joueurs -->
    <v-row v-for="(pair, pairIndex) in playerPairs" :key="'pair-' + pairIndex" class="mb-6">
      <v-col
        v-for="(player, playerIndex) in pair"
        :key="'player-' + player.id"
        cols="6"
      >
        <!-- Nom du joueur 1 personnalisé -->
        <p class="text-h6">
          {{ player.id === 0 ? 'Votre Armée' : 'Joueur ' + getPlayerNumber(pairIndex, playerIndex) }}
        </p>

        <v-text-field
          v-model="player.name"
          label="Nom du joueur"
          outlined
          class="input-field"
        />
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
          @update:model-value="player.armyComposition = ''"
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
        <v-text-field
          v-model="player.score"
          label="Score"
          type="number"
          outlined
          class="input-field"
        />

        <!-- Image dynamique -->
        <div
          v-if="player.army"
          class="battle-image"
          :style="{ backgroundImage: `url(${getArmyImageUrl(player.army)})` }"
        />

        <!-- Bouton de suppression (pas pour joueur 1) -->
        <v-btn
          color="error"
          variant="outlined"
          class="mt-2"
          @click="removePlayer(player.id)"
          v-if="player.id !== 0 && players.length > 2"
        >
          Supprimer ce joueur
        </v-btn>
      </v-col>
    </v-row>

    <!-- Bouton ajouter un joueur centré -->
    <div class="d-flex justify-center mt-4">
      <v-btn
        color="primary"
        variant="tonal"
        @click="addPlayer"
        :disabled="players.length >= 10"
      >
        Ajouter un joueur
      </v-btn>
    </div>

  </v-card-text>
</v-card>


      <!-- Sauvegarde -->
      <v-btn class="save-button" @click="saveBattleReport">Enregistrer le rapport</v-btn>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArmyNameStore } from '@/stores/armyName';
import { useArmyCompositionStore } from '@/stores/armyComposition';
import { useScenarioStore } from '@/stores/scenario';
import { useAllianceStore } from '@/stores/alliance';
import { useArmyStore } from '@/stores/army';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { usePlayerStore } from '@/stores/player';
import { useBattleReportStore } from '@/stores/battleReport';
import { useProfileStore } from '@/stores/profile';

// Router
const route = useRoute();
const router = useRouter();
const reportId = route.params.id || null;

// Stores
const armyCompositionStore = useArmyCompositionStore();
const armyNameStore = useArmyNameStore();
const scenarioStore = useScenarioStore();
const allianceStore = useAllianceStore();
const armyStore = useArmyStore();
const armyPhotoStore = useArmyPhotoStore();
const playerStore = usePlayerStore();
const battleReportStore = useBattleReportStore();
const profileStore = useProfileStore();

// Data
const battleTitle = ref('');
const description = ref('');
const scenario = ref('');
const armyPoints = ref(0);

const scenarios = computed(() => scenarioStore.scenario || []);
const armiesName = computed(() => armyNameStore.armyName || []);
const armiesComposition = computed(() => armyCompositionStore.armyComposition || []);
const alliances = computed(() => allianceStore.alliance || []);
const armyPhotos = computed(() => armyPhotoStore.armyPhoto || []);
const photos = ref([]);
const photoPreviews = ref([]);
const fileInput = ref(null);
const fileBattleReportPhoto = ref([]);

const triggerFileInput = () => {
  if (photos.value.length < 10) fileInput.value.click();
};

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  const availableSlots = 10 - photos.value.length;

  selectedFiles.slice(0, availableSlots).forEach((file) => {
    photos.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Reset l'input pour pouvoir recharger les mêmes fichiers
  event.target.value = '';
};

const removePhoto = (index) => {
  photos.value.splice(index, 1);
  photoPreviews.value.splice(index, 1);
};

// Initialisation des joueurs avec le pseudonyme pour le Joueur 1
const players = ref([
  {
    id: 0,
    name: profileStore.profile.username || '',
    alliance: '',
    army: '',
    armyComposition: '',
    score: 0
  },
  {
    id: 1,
    name: '',
    alliance: '',
    army: '',
    armyComposition: '',
    score: 0
  }
]);


let nextPlayerId = 2;

const addPlayer = () => {
  if (players.value.length < 10) {
    players.value.push({
      id: nextPlayerId++,
      name: '',
      alliance: '',
      army: '',
      armyComposition: '',
      score: 0
    });
  }
};

const removePlayer = (idToRemove) => {
  players.value = players.value.filter(p => p.id !== idToRemove);
};

// Calcule le numéro du joueur en fonction de sa position dans players
const getPlayerNumber = (pairIndex, playerIndexInPair) => {
  // Le numéro = index dans players + 1
  return pairIndex * 2 + playerIndexInPair + 1;
};

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
        c => c.idArmyComposition === army.armyComposition_idArmyComposition
      );
      if (comp && !uniqueCompositions.has(comp.idArmyComposition)) {
        uniqueCompositions.set(comp.idArmyComposition, comp);
      }
    });
  return Array.from(uniqueCompositions.values());
};

const getArmyImageUrl = (armyId) => {
  const photo = armyPhotos.value.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png';
};

const saveBattleReport = () => {
  const formData = new FormData();

  // Construction de l'objet à envoyer (sans photos)
  const reportToSend = {
    nameBattleReport: battleTitle.value,
    descriptionBattleReport: description.value,
    scenario_idScenario: scenario.value,
    armyPoints: armyPoints.value,
    idUser: profileStore.profile.id,
    players: players.value.map(p => ({
      playerName: p.name || null,
      playerScore: p.score != null ? String(p.score) : null,
      alliance_idAlliance: p.alliance ?? null,
      armyName_idArmyName: p.army ?? null,
      armyComposition_idArmyComposition: p.armyComposition ?? null,
    })),
    fileBattleReportPhoto: fileBattleReportPhoto.value.map(p => ({
      name: p.name || null,
      fileBattleReportPhoto: p.fileBattleReportPhoto || null,
    }))
  };

  let action;
  if (reportId) {
    action = battleReportStore.updateBattleReport({ ...reportToSend, idBattleReport: reportId });
  } else {
    action = battleReportStore.postBattleReport(reportToSend);
  }

  action
    .then(() => router.push('/AllBattleReports'))
    .catch(err => {
      console.error('Erreur lors de la sauvegarde :', err);
      alert('Une erreur est survenue. Vérifiez la console.');
    });
};


const loadBattleReport = (id) => {
  battleReportStore.fetchBattleReportById(id)
    .then(report => {
      battleTitle.value = report.nameBattleReport;
      description.value = report.descriptionBattleReport;
      scenario.value = report.scenario_idScenario;
      armyPoints.value = report.armyPoints;

      if (report.players?.length) {
  players.value = report.players.map((p, index) => ({
    id: index,
    name: index === 0 ? p.playerName || profileStore.profile.username : p.playerName,
    score: Number(p.playerScore),
    alliance: p.alliance_idAlliance,
    army: p.armyName_idArmyName,
    armyComposition: p.armyComposition_idArmyComposition
  }));
  nextPlayerId = report.players.length;
}

    })
    .catch(err => console.error('Erreur lors du chargement du rapport :', err));
};

onMounted(() => {
  armyNameStore.getArmyName();
  armyCompositionStore.getArmyComposition();
  scenarioStore.getScenario();
  allianceStore.getAlliance();
  armyStore.getArmy();
  armyPhotoStore.getArmyPhoto();

  if (reportId) loadBattleReport(reportId);
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

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.photo-thumbnail, .photo-add {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  position: relative;
  background-color: #f0f0f0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2px;
}

</style>
