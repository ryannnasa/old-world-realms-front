<template>
  <div class="background page-container">
    <v-container class="d-flex justify-center align-center flex-column">
      <!-- Titre principal -->
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold mb-4" style="color: #332018;">
          Politique de Confidentialité
        </h1>
        <p class="text-body-1" style="color: #332018; max-width: 700px;">
          Old World Realms s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.
        </p>
      </div>

      <!-- Contenu principal -->
      <v-row class="w-100" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="card-container mb-6">
            <v-card-text class="pa-8">
              
              <!-- Section 1: Informations collectées -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-information-outline</v-icon>
                  1. Informations que nous collectons
                </h2>
                <div class="section-content">
                  <h3 class="subsection-title">Informations fournies directement :</h3>
                  <ul class="policy-list mb-4">
                    <li>Nom d'utilisateur et mot de passe lors de l'inscription</li>
                    <li>Adresse email pour la communication</li>
                    <li>Prénom et nom (optionnels)</li>
                    <li>Contenu que vous publiez (rapports de bataille, commentaires)</li>
                  </ul>
                  
                  <h3 class="subsection-title">Informations collectées automatiquement :</h3>
                  <ul class="policy-list">
                    <li>Adresse IP et informations de navigation</li>
                    <li>Type de navigateur et système d'exploitation</li>
                    <li>Pages visitées et temps passé sur le site</li>
                    <li>Cookies nécessaires au fonctionnement du site</li>
                  </ul>
                </div>
              </div>

              <!-- Section 2: Utilisation des données -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-cog-outline</v-icon>
                  2. Comment nous utilisons vos données
                </h2>
                <div class="section-content">
                  <ul class="policy-list">
                    <li><strong>Fonctionnement du service :</strong> Gérer votre compte et vos publications</li>
                    <li><strong>Communication :</strong> Vous envoyer des notifications importantes</li>
                    <li><strong>Amélioration :</strong> Analyser l'utilisation pour améliorer notre site</li>
                    <li><strong>Sécurité :</strong> Protéger contre les abus et violations</li>
                    <li><strong>Conformité légale :</strong> Respecter nos obligations légales</li>
                  </ul>
                </div>
              </div>

              <!-- Section 3: Partage des données -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-share-variant-outline</v-icon>
                  3. Partage de vos informations
                </h2>
                <div class="section-content">
                  <p class="policy-text mb-3">
                    <strong>Nous ne vendons jamais vos données personnelles.</strong> Nous pouvons partager vos informations uniquement dans ces cas :
                  </p>
                  <ul class="policy-list">
                    <li><strong>Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement</li>
                    <li><strong>Prestataires de services :</strong> Hébergement, analyse, support technique</li>
                    <li><strong>Obligations légales :</strong> Si requis par la loi ou les autorités</li>
                    <li><strong>Protection des droits :</strong> Pour protéger nos droits et ceux de nos utilisateurs</li>
                  </ul>
                </div>
              </div>

              <!-- Section 4: Cookies -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-cookie-outline</v-icon>
                  4. Cookies et technologies similaires
                </h2>
                <div class="section-content">
                  <p class="policy-text mb-3">
                    Nous utilisons des cookies pour améliorer votre expérience :
                  </p>
                  <ul class="policy-list">
                    <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement (connexion, session)</li>
                    <li><strong>Cookies de performance :</strong> Analytics pour améliorer le site</li>
                    <li><strong>Cookies de préférences :</strong> Mémoriser vos choix et paramètres</li>
                  </ul>
                  <p class="policy-text mt-3">
                    Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
                  </p>
                </div>
              </div>

              <!-- Section 5: Vos droits -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-account-check-outline</v-icon>
                  5. Vos droits
                </h2>
                <div class="section-content">
                  <p class="policy-text mb-3">
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>
                  <ul class="policy-list">
                    <li><strong>Accès :</strong> Consulter les données que nous détenons sur vous</li>
                    <li><strong>Rectification :</strong> Corriger les informations inexactes</li>
                    <li><strong>Suppression :</strong> Demander l'effacement de vos données</li>
                    <li><strong>Portabilité :</strong> Récupérer vos données dans un format standard</li>
                    <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
                    <li><strong>Limitation :</strong> Limiter le traitement dans certains cas</li>
                  </ul>
                  <p class="policy-text mt-3">
                    Pour exercer ces droits, contactez-nous via notre 
                    <router-link to="/contact" class="policy-link">formulaire de contact</router-link>.
                  </p>
                </div>
              </div>

              <!-- Section 6: Sécurité -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-shield-check-outline</v-icon>
                  6. Sécurité des données
                </h2>
                <div class="section-content">
                  <p class="policy-text mb-3">
                    Nous mettons en place des mesures techniques et organisationnelles appropriées :
                  </p>
                  <ul class="policy-list">
                    <li>Chiffrement des données sensibles (HTTPS)</li>
                    <li>Accès restreint aux données personnelles</li>
                    <li>Sauvegardes régulières et sécurisées</li>
                    <li>Surveillance et détection des incidents</li>
                    <li>Formation de notre équipe sur la protection des données</li>
                  </ul>
                </div>
              </div>

              <!-- Section 7: Conservation des données -->
              <div class="policy-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-clock-outline</v-icon>
                  7. Conservation des données
                </h2>
                <div class="section-content">
                  <ul class="policy-list">
                    <li><strong>Comptes actifs :</strong> Tant que votre compte existe</li>
                    <li><strong>Comptes supprimés :</strong> 30 jours pour permettre la récupération</li>
                    <li><strong>Données de navigation :</strong> Maximum 2 ans</li>
                    <li><strong>Communications :</strong> 3 ans pour le support client</li>
                  </ul>
                </div>
              </div>

              <!-- Section 8: Modifications -->
              <div class="policy-section mb-4">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-update</v-icon>
                  8. Modifications de cette politique
                </h2>
                <div class="section-content">
                  <p class="policy-text">
                    Nous pouvons mettre à jour cette politique de confidentialité. Les modifications importantes 
                    vous seront notifiées par email ou via une notification sur le site. La version actuelle 
                    est toujours disponible sur cette page.
                  </p>
                  <p class="policy-text mt-3">
                    <strong>Dernière mise à jour :</strong> 28 juillet 2025
                  </p>
                </div>
              </div>

              <!-- Contact -->
              <div class="contact-section text-center">
                <v-divider class="my-6" color="#B8A082"></v-divider>
                <h3 class="contact-title mb-3">Questions sur cette politique ?</h3>
                <p class="contact-text mb-4">
                  Si vous avez des questions concernant cette politique de confidentialité ou 
                  l'utilisation de vos données, n'hésitez pas à nous contacter.
                </p>
                <router-link to="/contact">
                  <v-btn class="contact-button" large>
                    <v-icon class="mr-2">mdi-email-outline</v-icon>
                    Nous contacter
                  </v-btn>
                </router-link>
              </div>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Pas de logique JavaScript nécessaire pour cette page statique
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

.policy-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #EBDEC2;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #B8A082;
  padding-bottom: 8px;
}

.subsection-title {
  color: #EBDEC2;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.section-content {
  padding-left: 8px;
}

.policy-text {
  color: #B8A082;
  line-height: 1.6;
  font-size: 0.95rem;
}

.policy-list {
  color: #B8A082;
  line-height: 1.7;
  padding-left: 20px;
}

.policy-list li {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.policy-list li strong {
  color: #EBDEC2;
}

.policy-link {
  color: #EBDEC2;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.policy-link:hover {
  color: #B8A082;
  text-decoration: none;
}

.contact-section {
  background-color: rgba(184, 160, 130, 0.1);
  border-radius: 12px;
  padding: 24px;
  margin-top: 2rem;
}

.contact-title {
  color: #EBDEC2;
  font-size: 1.2rem;
  font-weight: 600;
}

.contact-text {
  color: #B8A082;
  font-size: 0.95rem;
  line-height: 1.6;
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
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .subsection-title {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .background {
    padding: 10px;
  }
  
  .page-container {
    margin-top: 60px;
  }
  
  .card-container {
    margin: 0 8px;
  }
  
  .section-content {
    padding-left: 4px;
  }
  
  .contact-section {
    padding: 16px;
  }
}
</style>
