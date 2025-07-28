<template>
  <div class="background page-container">
    <v-container class="d-flex justify-center align-center flex-column">
      <!-- Carte du compte -->
      <v-card class="mb-4 card-container">
        <v-card-title class="text-center">Mon compte</v-card-title>
        <v-card-text class="text-center">
          <v-text-field
            v-model="form.email"
            label="Adresse email"
            outlined
            class="input-field"
            :readonly="true"
          />
          <v-text-field
            v-model="form.firstName"
            label="Prénom"
            outlined
            class="input-field"
            :readonly="!isEditing"
          />
          <v-text-field
            v-model="form.lastName"
            label="Nom"
            outlined
            class="input-field"
            :readonly="!isEditing"
          />
          <v-text-field
            v-model="form.username"
            label="Pseudonyme"
            outlined
            class="input-field"
            :readonly="!isEditing"
          />
        </v-card-text>
      </v-card>

      <!-- Carte des actions -->
      <v-card-text class="d-flex flex-column align-center">
        <v-btn v-if="!isEditing" class="save-button mb-4" @click="enableEdit">
          Modifier mon compte
        </v-btn>

        <div v-else class="d-flex flex-column align-center">
          <v-btn class="save-button mb-2" @click="saveChanges">
            Enregistrer les modifications
          </v-btn>
          <v-btn color="grey" class="mb-4" @click="cancelEdit">
            Annuler les modifications
          </v-btn>
        </div>

        <v-btn class="save-button mb-4" @click="logout">Se déconnecter</v-btn>
      </v-card-text>
    </v-container>
  </div>

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
    {{ snackbarMessage }}
  </v-snackbar>

  <v-dialog v-model="saveDialog" max-width="500">
    <v-card class="card-container">
      <v-card-title class="text-h6">Confirmer les modifications</v-card-title>
      <v-card-text>
        Es-tu sûr de vouloir <strong>enregistrer les modifications</strong> de ton compte ?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="saveDialog = false" color="grey">Annuler</v-btn>
        <v-btn @click="performSave" color="primary" class="text-white">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const profile = computed(() => authStore.profile || {});
const isEditing = ref(false);
const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  username: ''
});
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const saveDialog = ref(false);

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const enableEdit = () => {
  isEditing.value = true;
  loadForm();
};

const cancelEdit = () => {
  isEditing.value = false;
  loadForm();
};

const loadForm = () => {
  form.value.email = profile.value.email;
  form.value.firstName = profile.value.firstName;
  form.value.lastName = profile.value.lastName;
  form.value.username = profile.value.username;
};

const saveChanges = () => {
  saveDialog.value = true; // Ouvre la modale de confirmation
};

const performSave = () => {
  const updated = {
    ...profile.value,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    username: form.value.username
  };

  profileStore.updateProfile(updated)
    .then(() => {
      showSnackbar('Compte mis à jour.');
      isEditing.value = false;
    })
    .catch(err => {
      console.error('Erreur lors de la mise à jour du compte :', err);
      showSnackbar('Erreur lors de la mise à jour du compte.', 'error');
    })
    .finally(() => {
      saveDialog.value = false;
    });
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

loadForm();
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
  display: flex;
  justify-content: center;
}

.v-container {
  max-width: 60%;
  width: 100%;
}

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
  width: 100%;
}

.save-button {
  background-color: #332018;
  color: #EBDEC2;
}

.input-field {
  color: #EBDEC2;
}
</style>
