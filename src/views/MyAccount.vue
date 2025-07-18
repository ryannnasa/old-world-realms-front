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

          <!-- Affichage du mot de passe actuel -->
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            v-model="form.currentPassword"
            label="Mot de passe actuel"
            outlined
            class="input-field"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="togglePassword"
            readonly
          />

          <!-- Champs pour modifier le mot de passe -->
          <div v-if="isEditing">
            <v-text-field
              :type="showNewPassword ? 'text' : 'password'"
              v-model="form.newPassword"
              label="Nouveau mot de passe"
              outlined
              class="input-field"
              :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="toggleNewPassword"
              :error="newPasswordError"
              :error-messages="newPasswordErrorMessage"
            />

            <v-text-field
              :type="showNewPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              label="Confirmer le nouveau mot de passe"
              outlined
              class="input-field"
              :error="passwordsDontMatch"
              :error-messages="passwordsDontMatch ? 'Les mots de passe ne correspondent pas.' : ''"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- Carte des actions -->
        <v-card-text class="d-flex flex-column align-center">
          <v-btn v-if="!isEditing" class="save-button mb-4" @click="enableEdit">
            Modifier mon compte
          </v-btn>

          <div v-else class="d-flex flex-column align-center">
            <v-btn class="save-button mb-2" @click="saveChanges" :disabled="!isPasswordValid">
              Enregistrer les modifications
            </v-btn>
            <v-btn color="grey" class="mb-4" @click="cancelEdit">
              Annuler les modifications
            </v-btn>
          </div>

          <v-btn class="save-button mb-4" @click="logout">Se déconnecter</v-btn>
          <v-btn color="red" class="mb-4" @click="confirmDelete">Supprimer mon compte</v-btn>
        </v-card-text>
    </v-container>
  </div>
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
  {{ snackbarMessage }}
</v-snackbar>
<v-dialog v-model="deleteDialog" max-width="500">
  <v-card class="card-container">
    <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
    <v-card-text>
      Es-tu sûr de vouloir <strong>supprimer ton compte</strong> ?<br />
      Cette action est <span class="text-red">irréversible</span>.
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn @click="deleteDialog = false" color="grey">Annuler</v-btn>
      <v-btn @click="performDelete" color="red" class="text-white">Supprimer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
<v-dialog v-model="saveDialog" max-width="500">
  <v-card class="card-container">
    <v-card-title class="text-h6">Confirmer les modifications</v-card-title>
    <v-card-text>
      Es-tu sûr de vouloir <strong>enregistrer les modifications</strong> de ton compte ?
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn @click="saveDialog.value = false" color="grey">Annuler</v-btn>
      <v-btn @click="performSave" color="primary" class="text-white">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profile';

const router = useRouter();
const profileStore = useProfileStore();

const profile = computed(() => profileStore.profile || {});
const isEditing = ref(false);
const showPassword = ref(false);
const showNewPassword = ref(false);
const confirmPassword = ref('');
const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  username: '',
  currentPassword: '',
  newPassword: ''
});
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const deleteDialog = ref(false);
const saveDialog = ref(false);

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

// Expressions régulières de validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;

// Erreurs de mot de passe
const newPasswordError = computed(() =>
  form.value.newPassword.length > 0 && !passwordRegex.test(form.value.newPassword)
);

const newPasswordErrorMessage = computed(() => {
  return newPasswordError.value
    ? 'Au moins 10 caractères avec majuscule, minuscule, chiffre et caractère spécial.'
    : '';
});

const passwordsDontMatch = computed(() =>
  form.value.newPassword && confirmPassword.value && form.value.newPassword !== confirmPassword.value
);

const isPasswordValid = computed(() => {
  if (!form.value.newPassword && !confirmPassword.value) return true; // mot de passe non modifié
  return passwordRegex.test(form.value.newPassword) && form.value.newPassword === confirmPassword.value;
});

// Actions
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const enableEdit = () => {
  isEditing.value = true;
  loadForm();
};

const cancelEdit = () => {
  isEditing.value = false;
  form.value.newPassword = '';
  confirmPassword.value = '';
};

const loadForm = () => {
  form.value.email = profile.value.email;
  form.value.firstName = profile.value.firstName;
  form.value.lastName = profile.value.lastName;
  form.value.username = profile.value.username;
  form.value.currentPassword = profile.value.password || '********';
  form.value.newPassword = '';
  confirmPassword.value = '';
};

const saveChanges = () => {
  // Si un nouveau mot de passe est saisi, il doit être valide
  if (form.value.newPassword) {
    if (!isPasswordValid.value) {
      showSnackbar('Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.', 'error');
      return;
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
      showSnackbar('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
  }

  saveDialog.value = true; // Ouvre la modale de confirmation
};

const performSave = () => {
  const updated = {
    ...profile.value,
    password: newPassword.value || profile.value.password
  };

  profileStore.updateProfile(updated)
    .then(() => {
      showSnackbar('Compte mis à jour.');
      isEditing.value = false;
      newPassword.value = '';
      confirmPassword.value = '';
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
  profileStore.logout();
  router.push('/login');
};

const confirmDelete = () => {
  deleteDialog.value = true;
};

const performDelete = () => {
  profileStore.deleteAccount(profile.value.id)
    .then(() => {
      showSnackbar('Compte supprimé.');
      router.push('/login');
    })
    .catch(err => {
      console.error('Erreur lors de la suppression :', err);
      showSnackbar('Échec de la suppression du compte.', 'error');
    })
    .finally(() => {
      deleteDialog.value = false;
    });
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
