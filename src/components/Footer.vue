<template>
  <v-footer dark class="my-footer mt-16">
    <v-container class="py-8">
      <v-row class="d-flex align-center justify-space-between">
        <!-- Logo et titre -->
        <v-col cols="12" md="4" class="text-center text-md-left">
          <div class="d-flex align-center justify-center justify-md-start mb-4">
            <img src="/img/Logo Old World Realms.png" alt="Logo" class="footer-logo">
            <div class="ml-3">
              <h3 class="footer-title">Old World Realms</h3>
              <p class="footer-subtitle">Votre communauté Warhammer</p>
            </div>
          </div>
        </v-col>

        <!-- Liens de navigation -->
        <v-col cols="12" md="4" class="text-center">
          <h4 class="footer-section-title mb-3">Navigation</h4>
          <div class="footer-links">
            <router-link to="/homepage" class="footer-link-plain mb-2">
              Accueil
            </router-link>
            <router-link to="/allbattlereports" class="footer-link-plain mb-2">
              Rapports de Batailles
            </router-link>
            <router-link to="/createabattlereport" class="footer-link-plain mb-2">
              Créer un Rapport
            </router-link>
            <router-link to="/myaccount" class="footer-link-plain mb-2">
              Mon Compte
            </router-link>
          </div>
        </v-col>

        <!-- Liens légaux -->
        <v-col cols="12" md="4" class="text-center text-md-right">
          <div class="footer-links">
            <h4 class="footer-section-title mb-3">Informations</h4>
            <router-link to="/contact" class="footer-link-plain mb-2">
              Contact
            </router-link>
            <router-link to="/legal" class="footer-link-plain mb-2">
              Mentions Légales
            </router-link>
            <router-link to="/confidentialite" class="footer-link-plain mb-2">
              Confidentialité
            </router-link>
            <router-link to="/cgu" class="footer-link-plain mb-2">
              CGU
            </router-link>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" color="amber darken-3"></v-divider>

      <!-- Copyright et réseaux sociaux -->
      <v-row class="align-center">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="copyright-text mb-0">
            © {{ currentYear }} Old World Realms. Tous droits réservés.
          </p>
          <p class="disclaimer-text mb-0">
            Warhammer® est une marque déposée de Games Workshop Ltd.
          </p>
        </v-col>
        
        <v-col cols="12" md="6" class="text-center text-md-right">
          <div class="social-links">
            <v-btn icon small href="https://www.facebook.com/WarhammerOfficial" target="_blank" class="social-btn">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon small href="https://www.instagram.com/warhammer.fra/" target="_blank" class="social-btn">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon small href="https://theoldworld.com/fr/" target="_blank" class="social-btn">
              <v-icon>mdi-web</v-icon>
            </v-btn>
            <v-btn icon small href="https://github.com/ryannnasa" target="_blank" class="social-btn">
              <v-icon>mdi-github</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.my-footer {
  background-color: #332018 !important;
  color: #EBDEC2 !important;
  width: 100% !important;
  margin: 0 !important;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.footer-logo {
  height: 200px;
  width: auto;
  object-fit: contain;
}

.footer-title {
  color: #EBDEC2;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.footer-subtitle {
  color: #B8A082;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.footer-section-title {
  color: #EBDEC2;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-link {
  color: #B8A082 !important;
  font-size: 0.9rem !important;
  text-transform: none !important;
  padding: 4px 8px !important;
  min-height: auto !important;
  height: auto !important;
  transition: color 0.3s ease !important;
}

.footer-link:hover {
  color: #EBDEC2 !important;
  background-color: rgba(235, 222, 194, 0.1) !important;
}

.footer-link-plain {
  color: #B8A082;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 4px 0;
  transition: color 0.3s ease;
}

.footer-link-plain:hover {
  color: #EBDEC2;
  text-decoration: none;
}

.copyright-text {
  color: #B8A082;
  font-size: 0.9rem;
  opacity: 0.9;
}

.disclaimer-text {
  color: #B8A082;
  font-size: 0.8rem;
  opacity: 0.7;
  font-style: italic;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.social-btn {
  color: #B8A082 !important;
  transition: all 0.3s ease !important;
}

.social-btn:hover {
  color: #EBDEC2 !important;
  background-color: rgba(235, 222, 194, 0.1) !important;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .footer-links {
    align-items: center;
  }
  
  .text-md-left {
    text-align: center !important;
  }
  
  .text-md-right {
    text-align: center !important;
  }
  
  .justify-md-start {
    justify-content: center !important;
  }

  /* Logo et titre en colonne sur mobile */
  .d-flex.align-center.justify-center.justify-md-start {
    flex-direction: column !important;
    align-items: center !important;
  }

  .ml-3 {
    margin-left: 0 !important;
    margin-top: 1rem !important;
    text-align: center !important;
  }
}

/* Divider styling */
.v-divider {
  opacity: 0.3;
}
</style>
