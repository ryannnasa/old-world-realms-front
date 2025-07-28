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
const selectedFiles = ref([]); // Nouveaux fichiers sélectionnés
const existingPhotos = ref([]); // Photos existantes du rapport (nom + URL)

// Fonction pour réinitialiser les données du formulaire
const resetFormData = () => {
  battleTitle.value = '';
  description.value = '';
  scenario.value = '';
  armyPoints.value = 0;
  photoPreviews.value = [];
  selectedFiles.value = [];
  existingPhotos.value = [];
  
  // Réinitialiser les joueurs avec les valeurs par défaut
  players.value = [
    { id: 0, name: authStore.profile?.username || '', alliance: '', army: '', armyComposition: '', score: 0 },
    { id: 1, name: '', alliance: '', army: '', armyComposition: '', score: 0 }
  ];
  nextPlayerId = 2;
};

// Gestion des fichiers photos
const triggerFileInput = () => {
  const maxPhotos = 10;
  const currentCount = existingPhotos.value.length + selectedFiles.value.length;
  if (currentCount < maxPhotos) fileInput.value.click();
};

const handleFileChange = (event) => {
  const newFiles = Array.from(event.target.files);
  const maxPhotos = 10;
  const availableSlots = maxPhotos - (existingPhotos.value.length + selectedFiles.value.length);
  
  // Traiter les nouveaux fichiers
  newFiles.slice(0, availableSlots).forEach((file) => {
    selectedFiles.value.push(file);
    
    // Créer une preview
    const reader = new FileReader();
    reader.onload = function(e) {
      photoPreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
  
  event.target.value = '';
};

// Suppression d'une photo
const removePhoto = (identifier, isExisting) => {
  if (isExisting) {
    // Supprimer une photo existante du serveur
    const photoIndex = existingPhotos.value.findIndex(p => p.name === identifier);
    if (photoIndex === -1) return;
    
    battleReportStore.deletePhotos(reportId.value, [identifier])
      .then(() => {
        // Supprimer de la liste locale
        existingPhotos.value.splice(photoIndex, 1);
        photoPreviews.value.splice(photoIndex, 1);
      })
      .catch(err => {
        console.error('Erreur suppression photo:', err);
        alert('Erreur lors de la suppression de la photo');
      });
  } else {
    // Supprimer un fichier nouvellement sélectionné
    const fileIndex = selectedFiles.value.findIndex(f => f.name === identifier);
    if (fileIndex === -1) return;
    
    selectedFiles.value.splice(fileIndex, 1);
    photoPreviews.value.splice(existingPhotos.value.length + fileIndex, 1);
  }
};

// Gestion des joueurs
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

// Filtrage des compositions d'armée
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

// URL de l'image d'armée
const getArmyImageUrl = (armyId) => {
  const photo = armyPhotos.value.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png';
};

// Sauvegarde du rapport
const saveBattleReport = () => {
  // Préparer les données à envoyer
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

  if (reportId.value) {
    // Mode modification : mettre à jour le rapport existant
    battleReportStore.updateBattleReport({ 
      ...reportToSend, 
      idBattleReport: reportId.value 
    })
    .then(() => {
      // Uploader les nouvelles photos si nécessaire
      if (selectedFiles.value.length > 0) {
        return battleReportStore.uploadPhotos(reportId.value, selectedFiles.value);
      }
      return Promise.resolve();
    })
    .then(() => {
      router.push('/AllBattleReports');
    })
    .catch(err => {
      console.error('Erreur lors de la sauvegarde :', err);
      alert('Une erreur est survenue lors de la sauvegarde.');
    });
  } else {
    // Mode création : créer un nouveau rapport
    battleReportStore.createBattleReport(reportToSend)
      .then(data => {
        if (!data || !data.idBattleReport) {
          throw new Error('Le rapport créé n\'a pas d\'ID');
        }
        
        // Uploader les photos si nécessaire
        if (selectedFiles.value.length > 0) {
          return battleReportStore.uploadPhotos(data.idBattleReport, selectedFiles.value);
        }
        return Promise.resolve();
      })
      .then(() => {
        router.push('/AllBattleReports');
      })
      .catch(err => {
        console.error('Erreur lors de la sauvegarde :', err);
        alert('Une erreur est survenue lors de la sauvegarde.');
      });
  }
};

// Chargement d'un rapport existant
const loadBattleReport = (id) => {
  battleReportStore.fetchBattleReportById(id)
    .then(report => {
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
      
      return fetch(`http://localhost:8080/battlereport/${id}/photos`);
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors du chargement des photos');
      return res.json();
    })
    .then(photoList => {
      // Réinitialiser les photos existantes
      existingPhotos.value = [];
      photoPreviews.value = [];
      
      // Charger les photos existantes avec leurs URLs
      const photoPromises = photoList.map(photo => 
        fetch(`http://localhost:8080/image-url/${photo.nameBattleReportPhoto}`)
          .then(res => {
            if (!res.ok) throw new Error('Erreur lors du chargement de l\'image');
            return res.text();
          })
          .then(url => ({
            name: photo.nameBattleReportPhoto,
            url: url
          }))
      );
      
      return Promise.all(photoPromises);
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

// Initialisation
onMounted(() => {
  // Charger tous les stores nécessaires
  Promise.all([
    armyNameStore.getArmyName(),
    armyCompositionStore.getArmyComposition(),
    scenarioStore.getScenario(),
    allianceStore.getAlliance(),
    armyStore.getArmy(),
    armyPhotoStore.getArmyPhoto()
  ]).then(() => {
    // Une fois les stores chargés, charger le rapport si c'est une modification
    if (reportId.value) {
      loadBattleReport(reportId.value);
    } else {
      // S'assurer que le formulaire est vide pour une création
      resetFormData();
    }
  }).catch(err => {
    console.error('Erreur lors du chargement des données :', err);
  });
});

// Watcher pour détecter les changements de route (modification -> création ou vice versa)
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    if (newId) {
      // Passer en mode modification
      loadBattleReport(newId);
    } else {
      // Passer en mode création - réinitialiser le formulaire
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

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

/* Responsive pour les cartes */
@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
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

/* Responsive pour le bouton de sauvegarde */
@media (max-width: 768px) {
  .save-button {
    padding: 12px 24px !important;
    min-width: 200px;
    max-width: 300px;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .save-button {
    padding: 10px 20px !important;
    min-width: 180px;
    max-width: 250px;
    border-radius: 8px;
  }
}

.input-field {
  color: #EBDEC2;
}

/* Responsive pour les champs de saisie */
@media (max-width: 768px) {
  .input-field {
    margin-bottom: 12px !important;
  }
  
  .input-field .v-field__input {
    font-size: 0.95rem !important;
  }
}

@media (max-width: 480px) {
  .input-field {
    margin-bottom: 10px !important;
  }
  
  .input-field .v-field__input {
    font-size: 0.9rem !important;
  }
}

/* Responsive pour les rangées de joueurs */
@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
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
}

.battle-image {
  width: 50%;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  margin: 20px auto 0 auto;
}

/* Responsive pour les images de bataille */
@media (max-width: 1200px) {
  .battle-image {
    width: 60%;
    height: 280px;
  }
}

@media (max-width: 959px) {
  .battle-image {
    width: 70%;
    height: 250px;
  }
}

@media (max-width: 768px) {
  .battle-image {
    width: 80%;
    height: 220px;
  }
}

@media (max-width: 600px) {
  .battle-image {
    width: 90%;
    height: 200px;
  }
}

@media (max-width: 480px) {
  .battle-image {
    width: 100%;
    height: 180px;
    margin: 15px auto 0 auto;
  }
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Responsive pour la grille de photos */
@media (max-width: 768px) {
  .photo-grid {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    gap: 6px;
  }
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

/* Responsive pour les thumbnails de photos */
@media (max-width: 768px) {
  .photo-thumbnail, .photo-add {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .photo-thumbnail, .photo-add {
    width: 70px;
    height: 70px;
  }
}

.remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 2px;
}

/* Responsive pour les boutons d'action */
@media (max-width: 768px) {
  .remove-btn {
    padding: 1px;
  }
  
  .remove-btn .v-icon {
    font-size: 18px !important;
  }
}

@media (max-width: 480px) {
  .remove-btn {
    top: 1px;
    right: 1px;
    padding: 1px;
  }
  
  .remove-btn .v-icon {
    font-size: 16px !important;
  }
}

/* Amélioration responsive pour les boutons d'ajout/suppression de joueurs */
@media (max-width: 768px) {
  .v-btn {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 480px) {
  .v-btn {
    font-size: 0.85rem !important;
    padding: 8px 16px !important;
  }
  
  .v-btn.v-btn--variant-outlined {
    border-width: 1px !important;
  }
}

</style>
