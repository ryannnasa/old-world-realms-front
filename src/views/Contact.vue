<template>
  <div class="background page-container">
    <v-container class="d-flex justify-center align-center flex-column">
      <!-- Titre principal -->
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold mb-4" style="color: #332018;">
          Contactez-nous
        </h1>
        <p class="text-body-1" style="color: #332018; max-width: 600px;">
          Une question sur Old World Realms ? Un problème technique ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      <v-row class="w-100" justify="center">
        <!-- Formulaire de contact -->
        <v-col cols="12" md="8" lg="6">
          <v-card class="card-container mb-6">
            <v-card-title class="text-center pb-2">
              <v-icon class="mr-2" color="#EBDEC2">mdi-email-outline</v-icon>
              Formulaire de contact
            </v-card-title>
            
            <v-card-text>
              <v-form ref="contactForm" v-model="isFormValid">
                <v-text-field
                  v-model="form.name"
                  label="Nom complet *"
                  outlined
                  class="input-field mb-3"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
                
                <v-text-field
                  v-model="form.email"
                  label="Adresse email *"
                  outlined
                  class="input-field mb-3"
                  :rules="[rules.required, rules.email]"
                  hide-details="auto"
                />
                
                <v-select
                  v-model="form.subject"
                  label="Sujet *"
                  outlined
                  class="input-field mb-3"
                  :items="subjectOptions"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
                
                <v-textarea
                  v-model="form.message"
                  label="Message *"
                  outlined
                  class="input-field mb-4"
                  rows="6"
                  :rules="[rules.required, rules.minLength]"
                  hide-details="auto"
                  counter="500"
                  maxlength="500"
                />
                
                <div class="text-center">
                  <v-btn 
                    class="contact-button" 
                    @click="submitForm"
                    :disabled="!isFormValid || isSubmitting"
                    :loading="isSubmitting"
                    large
                  >
                    <v-icon class="mr-2">mdi-send</v-icon>
                    Envoyer le message
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Snackbar de confirmation -->
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="5000">
    {{ snackbarMessage }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, reactive } from 'vue';

const contactForm = ref(null);
const isFormValid = ref(false);
const isSubmitting = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const subjectOptions = [
  'Question générale',
  'Problème technique',
  'Suggestion d\'amélioration',
  'Signalement d\'un bug',
  'Demande de fonctionnalité',
  'Problème de compte',
  'Autre'
];

const rules = {
  required: value => !!value || 'Ce champ est obligatoire',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Adresse email invalide';
  },
  minLength: value => (value && value.length >= 10) || 'Le message doit contenir au moins 10 caractères'
};

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const submitForm = async () => {
  if (!isFormValid.value) {
    showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulation d'envoi (remplacez par votre API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Réinitialiser le formulaire
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
    
    showSnackbar('Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.', 'success');
  } catch (error) {
    showSnackbar('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.', 'error');
    console.error('Erreur lors de l\'envoi:', error);
  } finally {
    isSubmitting.value = false;
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
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
}

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.input-field {
  color: #EBDEC2;
}

.input-field :deep(.v-field) {
  background-color: rgba(235, 222, 194, 0.05);
  border-radius: 8px;
}

.input-field :deep(.v-field__field) {
  color: #EBDEC2;
}

.input-field :deep(.v-field__outline) {
  color: #B8A082;
}

.input-field :deep(.v-label) {
  color: #B8A082;
}

.input-field :deep(.v-field--focused .v-field__outline) {
  color: #EBDEC2;
}

.contact-button {
  background-color: #B8A082 !important;
  color: #332018 !important;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.contact-button:hover {
  background-color: #EBDEC2 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 160, 130, 0.4);
}

/* Responsive */
@media (max-width: 960px) {
  .page-container {
    padding-top: 20px;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .background {
    padding: 10px;
  }
  
  .page-container {
    margin-top: 60px;
  }
}
</style>
