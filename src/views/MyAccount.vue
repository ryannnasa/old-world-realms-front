<template>
  <div class="background page-container">
    <v-container class="d-flex justify-center align-center flex-column account-content">
      <v-card class="mb-4 card-container">
        <v-card-title class="text-center">Mon compte</v-card-title>
        <v-card-text class="text-center form-content">
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

      <v-card-text class="d-flex flex-column align-center action-buttons">
        <v-btn v-if="!isEditing" class="save-button mb-4 action-btn" @click="enableEdit">
          Modifier mon compte
        </v-btn>

        <div v-else class="d-flex flex-column align-center action-group">
          <v-btn class="save-button mb-2 action-btn" @click="saveChanges">
            Enregistrer les modifications
          </v-btn>
          <v-btn color="grey" class="mb-4 action-btn" @click="cancelEdit">
            Annuler les modifications
          </v-btn>
        </div>

        <v-btn class="save-button mb-4 action-btn" @click="logout">Se déconnecter</v-btn>
      </v-card-text>
    </v-container>
  </div>

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
    {{ snackbarMessage }}
  </v-snackbar>

  <v-dialog v-model="saveDialog" max-width="500" class="responsive-dialog">
    <v-card class="card-container dialog-card">
      <v-card-title class="text-h6 dialog-title">Confirmer les modifications</v-card-title>
      <v-card-text class="dialog-content">
        Es-tu sûr de vouloir <strong>enregistrer les modifications</strong> de ton compte ?
      </v-card-text>
      <v-card-actions class="justify-end dialog-actions">
        <v-btn @click="saveDialog = false" color="grey" class="dialog-btn">Annuler</v-btn>
        <v-btn @click="performSave" color="primary" class="text-white dialog-btn">Enregistrer</v-btn>
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
  saveDialog.value = true;
};

const performSave = () => {
  const updated = {
    ...profile.value,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    username: form.value.username
  };

  authStore.updateProfile(updated)
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
  padding: 0;
}

.page-container {
  margin-top: 80px;
  background-color: rgba(33, 21, 16, 0.9);
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.v-container {
  max-width: 60%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.account-content {
  width: 100%;
}

@media (max-width: 1200px) {
  .v-container {
    max-width: 70%;
  }
  
  .page-container {
    margin-top: 90px;
    min-height: calc(100vh - 90px);
    padding: 15px;
  }
}

@media (max-width: 960px) {
  .v-container {
    max-width: 85%;
  }
  
  .page-container {
    margin-top: 100px;
    min-height: calc(100vh - 100px);
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .v-container {
    max-width: 95%;
  }
  
  .page-container {
    margin-top: 110px;
    min-height: calc(100vh - 110px);
    padding: 10px;
  }
  
  .card-container {
    border-radius: 12px;
  }
  
  .v-card-title {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .v-container {
    max-width: 98%;
  }
  
  .page-container {
    margin-top: 120px;
    min-height: calc(100vh - 120px);
    padding: 8px;
  }
  
  .card-container {
    border-radius: 10px;
  }
  
  .v-card-title {
    font-size: 1.3rem !important;
  }
  
  .save-button, .v-btn {
    width: 100%;
    margin-bottom: 8px !important;
  }
}

@media (max-width: 480px) {
  .v-container {
    max-width: 100%;
  }
  
  .page-container {
    margin-top: 130px;
    min-height: calc(100vh - 130px);
    padding: 5px;
  }
  
  .card-container {
    border-radius: 8px;
    margin-bottom: 15px !important;
  }
  
  .v-card-title {
    font-size: 1.2rem !important;
    padding: 12px !important;
  }
  
  .v-card-text {
    padding: 12px !important;
  }
  
  .input-field {
    margin-bottom: 8px;
  }
  
  .save-button, .v-btn {
    width: 100%;
    margin-bottom: 10px !important;
    padding: 12px !important;
  }
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

.action-buttons {
  gap: 8px;
}

.action-btn {
  min-width: 200px;
}

.action-group {
  width: 100%;
  gap: 8px;
}

.form-content {
  padding: 20px !important;
}

.dialog-card {
  margin: 10px;
}

.dialog-title {
  padding: 16px 20px 8px 20px !important;
}

.dialog-content {
  padding: 8px 20px 16px 20px !important;
}

.dialog-actions {
  padding: 8px 20px 16px 20px !important;
  gap: 8px;
}

.dialog-btn {
  min-width: 80px;
}
</style>
