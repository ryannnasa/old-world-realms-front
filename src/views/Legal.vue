<template>
  <div class="background page-container">
    <v-container class="d-flex justify-center align-center flex-column">
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold mb-4" style="color: #332018;">
          Mentions Légales
        </h1>
        <p class="text-body-1" style="color: #332018; max-width: 700px;">
          Informations légales obligatoires concernant Old World Realms et son éditeur.
        </p>
      </div>

      
      <v-row class="w-100" justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="card-container mb-6">
            <v-card-text class="pa-8">
              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-domain</v-icon>
                  1. Éditeur du site
                </h2>
                <div class="section-content">
                  <p class="legal-text mb-3">
                    <strong>Nom du site :</strong> Old World Realms<br>
                    <strong>URL :</strong> https://oldworldrealms.com<br>
                    <strong>Propriétaire :</strong> [Nom de l'éditeur]<br>
                    <strong>Adresse :</strong> [Adresse complète]<br>
                    <strong>Email :</strong> contact@oldworldrealms.com<br>
                    <strong>Téléphone :</strong> [Numéro de téléphone]
                  </p>
                  <p class="legal-text">
                    <strong>Directeur de la publication :</strong> [Nom du directeur]<br>
                    <strong>Responsable de la rédaction :</strong> [Nom du responsable]
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-server</v-icon>
                  2. Hébergement
                </h2>
                <div class="section-content">
                  <p class="legal-text">
                    <strong>Hébergeur :</strong> [Nom de l'hébergeur]<br>
                    <strong>Adresse :</strong> [Adresse de l'hébergeur]<br>
                    <strong>Téléphone :</strong> [Téléphone de l'hébergeur]<br>
                    <strong>Site web :</strong> [URL de l'hébergeur]
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-copyright</v-icon>
                  3. Propriété intellectuelle
                </h2>
                <div class="section-content">
                  <h3 class="subsection-title">Contenu du site :</h3>
                  <p class="legal-text mb-4">
                    L'ensemble du contenu de ce site (textes, images, vidéos, design, structure) est protégé par les droits de propriété intellectuelle. 
                    Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite 
                    sans l'accord écrit préalable d'Old World Realms.
                  </p>

                  <h3 class="subsection-title">Marques tierces :</h3>
                  <ul class="legal-list mb-4">
                    <li><strong>Warhammer®</strong> est une marque déposée de Games Workshop Ltd.</li>
                    <li><strong>The Old World™</strong> est une marque commerciale de Games Workshop Ltd.</li>
                    <li>Toutes les images et illustrations Warhammer sont la propriété de Games Workshop Ltd.</li>
                    <li>Old World Realms est un site non officiel et indépendant de Games Workshop Ltd.</li>
                  </ul>

                  <h3 class="subsection-title">Contenu utilisateur :</h3>
                  <p class="legal-text">
                    En publiant du contenu sur Old World Realms (rapports de bataille, commentaires, images), vous accordez au site 
                    une licence non exclusive d'utilisation, de reproduction et de diffusion de ce contenu dans le cadre du service proposé.
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-shield-alert-outline</v-icon>
                  4. Limitation de responsabilité
                </h2>
                <div class="section-content">
                  <p class="legal-text mb-3">
                    Old World Realms s'efforce de fournir des informations exactes et à jour, mais ne peut garantir l'exactitude, 
                    la complétude ou l'actualité des informations diffusées.
                  </p>
                  <ul class="legal-list mb-4">
                    <li>Le site est fourni "en l'état" sans garanties expresses ou implicites</li>
                    <li>Old World Realms ne saurait être tenu responsable des dommages directs ou indirects</li>
                    <li>L'utilisateur assume l'entière responsabilité de l'utilisation qu'il fait du site</li>
                    <li>Les liens externes sont fournis à titre informatif sans engagement de notre part</li>
                  </ul>

                  <h3 class="subsection-title">Interruptions de service :</h3>
                  <p class="legal-text">
                    En raison de la nature d'Internet, Old World Realms ne peut garantir la continuité du service et décline 
                    toute responsabilité en cas d'interruption, quelle qu'en soit la cause.
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-account-lock-outline</v-icon>
                  5. Protection des données personnelles
                </h2>
                <div class="section-content">
                  <p class="legal-text mb-3">
                    Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général 
                    sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles.
                  </p>
                  <p class="legal-text">
                    Pour plus d'informations sur la collecte et le traitement de vos données, consultez notre 
                    <router-link to="/confidentialite" class="legal-link">Politique de Confidentialité</router-link>.
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-cookie-outline</v-icon>
                  6. Cookies
                </h2>
                <div class="section-content">
                  <p class="legal-text mb-3">
                    Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                    En continuant à naviguer sur ce site, vous acceptez l'utilisation de ces cookies.
                  </p>
                  <ul class="legal-list">
                    <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site</li>
                    <li><strong>Cookies d'analyse :</strong> Pour comprendre l'utilisation du site</li>
                    <li><strong>Cookies de préférences :</strong> Pour mémoriser vos choix</li>
                  </ul>
                </div>
              </div>

              
              <div class="legal-section mb-6">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-gavel</v-icon>
                  7. Loi applicable et juridiction
                </h2>
                <div class="section-content">
                  <p class="legal-text mb-3">
                    Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                    les tribunaux français seront seuls compétents.
                  </p>
                  <p class="legal-text">
                    Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 
                    pour la Confiance dans l'économie numérique, nous vous informons que la responsabilité du site 
                    ne saurait être engagée du fait des activités ou informations stockées à la demande d'un utilisateur.
                  </p>
                </div>
              </div>

              
              <div class="legal-section mb-4">
                <h2 class="section-title mb-4">
                  <v-icon class="mr-2" color="#EBDEC2">mdi-update</v-icon>
                  8. Modification des mentions légales
                </h2>
                <div class="section-content">
                  <p class="legal-text">
                    Old World Realms se réserve le droit de modifier les présentes mentions légales à tout moment. 
                    Il est donc conseillé de les consulter régulièrement. Les modifications entrent en vigueur 
                    dès leur publication sur le site.
                  </p>
                  <p class="legal-text mt-3">
                    <strong>Dernière mise à jour :</strong> 28 juillet 2025
                  </p>
                </div>
              </div>

              
              <div class="contact-section text-center">
                <v-divider class="my-6" color="#B8A082"></v-divider>
                <h3 class="contact-title mb-3">Questions juridiques ?</h3>
                <p class="contact-text mb-4">
                  Pour toute question concernant ces mentions légales ou aspects juridiques du site, 
                  n'hésitez pas à nous contacter.
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

.legal-section {
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

.legal-text {
  color: #B8A082;
  line-height: 1.6;
  font-size: 0.95rem;
}

.legal-list {
  color: #B8A082;
  line-height: 1.7;
  padding-left: 20px;
}

.legal-list li {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.legal-list li strong {
  color: #EBDEC2;
}

.legal-link {
  color: #EBDEC2;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.legal-link:hover {
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
