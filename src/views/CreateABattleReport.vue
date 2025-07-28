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
          <v-textarea 
            v-model="description" 
            label="Racontez votre bataille..." 
            outlined 
            class="input-field"
            auto-grow
            rows="3"
            max-rows="15"
          />
          <!-- Photos -->
<v-card class="mb-4 card-container">
  <v-card-title>Photos de la bataille</v-card-title>
  <v-card-text>
    <div class="photo-grid">
      <!-- Photos existantes -->
      <div
        v-for="(photo, idx) in existingPhotos"
        :key="'existing-' + photo.name"
        class="photo-thumbnail"
      >
        <v-img :src="photo.url" aspect-ratio="1" cover />
        <v-btn icon class="remove-btn" @click="removePhoto(photo.name, true)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>
      <!-- Nouvelles photos -->
      <div
        v-for="(file, idx) in selectedFiles"
        :key="'new-' + file.name"
        class="photo-thumbnail"
      >
        <v-img :src="photoPreviews[existingPhotos.length + idx]" aspect-ratio="1" cover />
        <v-btn icon class="remove-btn" @click="removePhoto(file.name, false)">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>
      <!-- Ajout -->
      <div v-if="existingPhotos.length + selectedFiles.length < 10" class="photo-add" @click="triggerFileInput">
        <v-icon size="36">mdi-plus</v-icon>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="d-none"
        @change="handleFileChange"
      />
    </div>
    <div class="text-caption mt-2">
      <p class="mb-1">Maximum : 10 photos</p>
      <p class="mb-0 text-grey">Formats acceptés: JPG, PNG, WebP | Taille max: 5MB par photo</p>
    </div>
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
        cols="12"
        md="6"
        class="player-column"
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
      <div class="d-flex justify-center mt-4">
        <v-btn class="save-button" @click="saveBattleReport">Enregistrer le rapport</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArmyNameStore } from '@/stores/armyName';
import { useArmyCompositionStore } from '@/stores/armyComposition';
import { useScenarioStore } from '@/stores/scenario';
import { useAllianceStore } from '@/stores/alliance';
import { useArmyStore } from '@/stores/army';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useBattleReportStore } from '@/stores/battleReport';
import { useAuthStore } from '@/stores/auth';
import _ from 'lodash';

const route = useRoute();
const router = useRouter();
const reportId = computed(() => route.params.id || null);

const armyCompositionStore = useArmyCompositionStore();
const armyNameStore = useArmyNameStore();
const scenarioStore = useScenarioStore();
const allianceStore = useAllianceStore();
const armyStore = useArmyStore();
const armyPhotoStore = useArmyPhotoStore();
const battleReportStore = useBattleReportStore();
const authStore = useAuthStore();
const battleTitle = ref('');
const description = ref('');
const scenario = ref('');
const armyPoints = ref(0);
const scenarios = computed(() => scenarioStore.scenario || []);
const armiesName = computed(() => armyNameStore.armyName || []);
const armiesComposition = computed(() => armyCompositionStore.armyComposition || []);
const alliances = computed(() => allianceStore.alliance || []);
const armyPhotos = computed(() => armyPhotoStore.armyPhoto || []);
const photoPreviews = ref([]);
const fileInput = ref(null);
const selectedFiles = ref([]);
const existingPhotos = ref([]);
const resetFormData = () => {
  battleTitle.value = '';
  description.value = '';
  scenario.value = '';
  armyPoints.value = 0;
  photoPreviews.value = [];
  selectedFiles.value = [];
  existingPhotos.value = [];
  players.value = [
    { id: 0, name: authStore.profile?.username || '', alliance: '', army: '', armyComposition: '', score: 0 },
    { id: 1, name: '', alliance: '', army: '', armyComposition: '', score: 0 }
  ];
  nextPlayerId = 2;
};

const triggerFileInput = () => {
  const maxPhotos = 10;
  const currentCount = existingPhotos.value.length + selectedFiles.value.length;
  if (currentCount < maxPhotos) fileInput.value.click();
};

const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files);
  const maxPhotos = 10;
  const maxFileSize = 5 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const availableSlots = maxPhotos - (existingPhotos.value.length + selectedFiles.value.length);
  const validFiles = [];
  const errors = [];
  
  newFiles.forEach((file) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Format non supporté. Utilisez JPG, PNG ou WebP.`);
      return;
    }
    if (file.size > maxFileSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      errors.push(`${file.name}: Fichier trop volumineux (${fileSizeMB}MB). Maximum autorisé: 5MB.`);
      return;
    }
    validFiles.push(file);
  });
  if (errors.length > 0) {
    alert('Erreurs détectées:\n\n' + errors.join('\n\n') + '\n\nLes fichiers valides ont été ajoutés.');
  }
  validFiles.slice(0, availableSlots).forEach((file) => {
    selectedFiles.value.push(file);    
    const reader = new FileReader();
    reader.onload = function(e) {
      photoPreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
  if (validFiles.length > availableSlots) {
    alert(`Seuls ${availableSlots} fichier(s) ont été ajoutés. Limite de ${maxPhotos} photos atteinte.`);
  }  
  event.target.value = '';
};

const removePhoto = (identifier, isExisting) => {
  if (isExisting) {
    const photoIndex = existingPhotos.value.findIndex(p => p.name === identifier);
    if (photoIndex === -1) return;
    
    battleReportStore.deletePhotos(reportId.value, [identifier])
      .then(() => {
        existingPhotos.value.splice(photoIndex, 1);
        photoPreviews.value.splice(photoIndex, 1);
      })
      .catch(err => {
        console.error('Erreur suppression photo:', err);
        alert('Erreur lors de la suppression de la photo');
      });
  } else {
    const fileIndex = selectedFiles.value.findIndex(f => f.name === identifier);
    if (fileIndex === -1) return;
    
    selectedFiles.value.splice(fileIndex, 1);
    photoPreviews.value.splice(existingPhotos.value.length + fileIndex, 1);
  }
};

const players = ref([
  { id: 0, name: authStore.profile?.username || '', alliance: '', army: '', armyComposition: '', score: 0 },
  { id: 1, name: '', alliance: '', army: '', armyComposition: '', score: 0 }
]);
let nextPlayerId = 2;

const addPlayer = () => {
  if (players.value.length < 10) {
    players.value.push({ id: nextPlayerId++, name: '', alliance: '', army: '', armyComposition: '', score: 0 });
  }
};

const removePlayer = (idToRemove) => {
  players.value = players.value.filter(p => p.id !== idToRemove);
};

const getPlayerNumber = (pairIndex, playerIndexInPair) => {
  return pairIndex * 2 + playerIndexInPair + 1;
};

const playerPairs = computed(() => _.chunk(players.value, 2));

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
  const reportToSend = {
    nameBattleReport: battleTitle.value,
    descriptionBattleReport: description.value,
    scenario_idScenario: scenario.value,
    armyPoints: armyPoints.value,
    idUser: authStore.profile.id,
    players: players.value.map(p => ({
      playerName: p.name || null,
      playerScore: p.score != null ? String(p.score) : null,
      alliance_idAlliance: p.alliance ?? null,
      armyName_idArmyName: p.army ?? null,
      armyComposition_idArmyComposition: p.armyComposition ?? null,
    })),
  };
  const handlePhotoUpload = (reportData) => {
    if (selectedFiles.value.length > 0) {
      const targetId = reportId.value || reportData.idBattleReport;
      return battleReportStore.uploadPhotos(targetId, selectedFiles.value);
    }
    return Promise.resolve();
  };
  const handleSuccess = () => {
    router.push('/AllBattleReports');
  };
  const handleError = (err) => {
    console.error('Erreur lors de la sauvegarde :', err);
    alert('Une erreur est survenue lors de la sauvegarde.');
  };

  if (reportId.value) {
    battleReportStore.updateBattleReport({ 
      ...reportToSend, 
      idBattleReport: reportId.value 
    })
    .then(handlePhotoUpload)
    .then(handleSuccess)
    .catch(handleError);
  } else {
    battleReportStore.createBattleReport(reportToSend)
      .then(data => {
        if (!data?.idBattleReport) {
          throw new Error('Le rapport créé n\'a pas d\'ID');
        }
        return handlePhotoUpload(data);
      })
      .then(handleSuccess)
      .catch(handleError);
  }
};

const loadReportData = (report) => {
  battleTitle.value = report.nameBattleReport;
  description.value = report.descriptionBattleReport;
  scenario.value = report.scenario_idScenario;
  armyPoints.value = report.armyPoints;
  
  players.value = report.players.map((player, index) => ({
    id: index,
    name: player.playerName || '',
    alliance: player.alliance_idAlliance || '',
    army: player.armyName_idArmyName || '',
    armyComposition: player.armyComposition_idArmyComposition || '',
    score: player.playerScore ? Number(player.playerScore) : 0,
  }));
  
  nextPlayerId = players.value.length;
};

const loadPhotoUrl = (photo) => {
  return fetch(`http://localhost:8080/image-url/${photo.nameBattleReportPhoto}`)
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors du chargement de l\'image');
      return res.text();
    })
    .then(url => ({
      name: photo.nameBattleReportPhoto,
      url: url
    }));
};

const loadBattleReport = (id) => {
  battleReportStore.fetchBattleReportById(id)
    .then(report => {
      loadReportData(report);
      return fetch(`http://localhost:8080/battlereport/${id}/photos`);
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors du chargement des photos');
      return res.json();
    })
    .then(photoList => {
      existingPhotos.value = [];
      photoPreviews.value = [];
      return Promise.all(photoList.map(loadPhotoUrl));
    })
    .then(photos => {
      existingPhotos.value = photos;
      photoPreviews.value = photos.map(photo => photo.url);
    })
    .catch(err => {
      console.error('Erreur chargement rapport:', err);
      alert('Erreur chargement rapport.');
    });
};

onMounted(() => {
  Promise.all([
    armyNameStore.getArmyName(),
    armyCompositionStore.getArmyComposition(),
    scenarioStore.getScenario(),
    allianceStore.getAlliance(),
    armyStore.getArmy(),
    armyPhotoStore.getArmyPhoto()
  ]).then(() => {
    if (reportId.value) {
      loadBattleReport(reportId.value);
    } else {
      resetFormData();
    }
  }).catch(err => {
    console.error('Erreur lors du chargement des données :', err);
  });
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    if (newId) {
      loadBattleReport(newId);
    } else {
      resetFormData();
    }
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
  padding: 20px;
}

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

.save-button {
  background-color: #332018;
  color: #EBDEC2;
  min-width: 250px;
  max-width: 400px;
  margin-bottom: 20px;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
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

/* === RESPONSIVE DESIGN === */

/* Breakpoint 1200px */
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
    width: 60%;
    height: 280px;
  }
}

/* Breakpoint 959px */
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
    width: 70%;
    height: 250px;
  }
}

/* Breakpoint 768px */
@media (max-width: 768px) {
  .page-container {
    margin-top: 110px;
    min-height: calc(100vh - 110px);
    padding: 10px;
  }
  
  .background {
    padding: 10px;
  }
  
  .card-container {
    border-radius: 12px;
  }
  
  .card-container .v-card-title {
    font-size: 1.2rem !important;
    padding: 12px 16px !important;
  }
  
  .card-container .v-card-text {
    padding: 12px 16px !important;
  }
  
  .save-button {
    padding: 12px 24px !important;
    min-width: 200px;
    max-width: 300px;
    border-radius: 10px;
  }
  
  .input-field {
    margin-bottom: 12px !important;
  }
  
  .input-field .v-field__input {
    font-size: 0.95rem !important;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem !important;
  }
  
  .player-column {
    margin-bottom: 2rem !important;
  }
  
  .player-column:not(:last-child) {
    border-bottom: 2px solid #332018;
    padding-bottom: 1.5rem !important;
  }
  
  .battle-image {
    width: 80%;
    height: 220px;
  }
  
  .photo-grid {
    gap: 8px;
  }
  
  .photo-thumbnail, .photo-add {
    width: 80px;
    height: 80px;
  }
  
  .remove-btn {
    padding: 1px;
  }
  
  .remove-btn .v-icon {
    font-size: 18px !important;
  }
  
  .v-btn {
    font-size: 0.9rem !important;
  }
}

/* Breakpoint 600px */
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
    width: 90%;
    height: 200px;
  }
}

/* Breakpoint 480px */
@media (max-width: 480px) {
  .page-container {
    margin-top: 130px;
    min-height: calc(100vh - 130px);
    padding: 5px;
  }
  
  .background {
    padding: 5px;
  }
  
  .card-container {
    border-radius: 10px;
  }
  
  .card-container .v-card-title {
    font-size: 1.1rem !important;
    padding: 10px 12px !important;
  }
  
  .card-container .v-card-text {
    padding: 10px 12px !important;
  }
  
  .save-button {
    padding: 10px 20px !important;
    min-width: 180px;
    max-width: 250px;
    border-radius: 8px;
  }
  
  .input-field {
    margin-bottom: 10px !important;
  }
  
  .input-field .v-field__input {
    font-size: 0.9rem !important;
  }
  
  .mb-6 {
    margin-bottom: 1rem !important;
  }
  
  .player-column {
    margin-bottom: 1.5rem !important;
  }
  
  .player-column:not(:last-child) {
    border-bottom: 2px solid #332018;
    padding-bottom: 1rem !important;
  }
  
  .text-h6 {
    font-size: 1.1rem !important;
    margin-bottom: 8px !important;
  }
  
  .battle-image {
    width: 100%;
    height: 180px;
    margin: 15px auto 0 auto;
  }
  
  .photo-grid {
    gap: 6px;
  }
  
  .photo-thumbnail, .photo-add {
    width: 70px;
    height: 70px;
  }
  
  .remove-btn {
    top: 1px;
    right: 1px;
    padding: 1px;
  }
  
  .remove-btn .v-icon {
    font-size: 16px !important;
  }
  
  .v-btn {
    font-size: 0.85rem !important;
    padding: 8px 16px !important;
  }
  
  .v-btn.v-btn--variant-outlined {
    border-width: 1px !important;
  }
}
</style>
