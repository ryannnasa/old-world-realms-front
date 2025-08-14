<template>
  <v-container fluid class="pa-0">
    <v-carousel
      hide-delimiter-background
      show-arrows-on-hover
      cycle
      height="100vh"
      class="rounded-0 main-carousel"
    >
      <v-carousel-item
        v-for="(item, i) in siteNews"
        :key="i"
      >
        <v-img :src="item.image" height="100%" cover>
          <div class="d-flex align-center justify-center fill-height text-center">
            <div class="carousel-text px-6">
              <h2 class="text-h3 font-weight-bold mb-4">{{ item.title }}</h2>
              <p class="text-subtitle-1 mb-4">{{ item.description }}</p>
              
              <v-btn
                v-if="item.button"
                class="carousel-button mt-4"
                @click="handleButtonClick(item.button)"
              >
                <v-icon left v-if="item.button.icon">{{ item.button.icon }}</v-icon>
                {{ item.button.text }}
              </v-btn>
            </div>
          </div>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-divider class="my-0" thickness="6" color="amber darken-3" />

    
<v-container class="py-16" style="min-height: 80vh;">
  <v-row justify="space-between" align="center" class="presentation-row">
    <v-col cols="12" md="6" class="text-center text-md-left" style="max-width: 42rem; margin-left: 0;">
      <h1 class="text-h3 font-weight-bold mb-8" style="max-width: none;">
        Bienvenue sur Old World Realms
      </h1>
      <p class="text-body-1 mb-6">
        Old World Realms est une encyclopédie interactive dédiée à Warhammer: The Old World. Que vous soyez joueur débutant ou vétéran, vous trouverez ici toutes les règles des armées, des outils pour créer vos listes, partager vos rapports de batailles, et suivre vos campagnes.
      </p>
      <p class="text-body-1 mb-6">
        Plongez dans l’univers riche et sombre du Vieux Monde, explorez les différentes factions et leurs traditions ancestrales, consultez les scénarios officiels et découvrez comment d'autres joueurs racontent leurs affrontements épiques à travers nos rapports illustrés.
      </p>
      <p class="text-body-1">
        Grâce à notre communauté passionnée, vous pouvez non seulement consulter les règles, mais aussi partager vos propres campagnes, échanger stratégies et récits, et vivre l’expérience immersive d’un monde en perpétuelle évolution. Embarquez pour une aventure unique où chaque bataille façonne l’histoire du Vieux Monde.
      </p>
    </v-col>
    <v-col
      cols="12"
      md="6"
      style="max-width: 55rem; min-width: 20rem;"
    >
      <div
        style="
          background-image: url('/public/img/site/site1.jpg');
          background-size: cover;
          background-position: center;
          height: 550px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          min-width: 20rem;
        "
        aria-label="Image représentant le Vieux Monde"
        role="img"
      ></div>
    </v-col>
  </v-row>
</v-container>

    <v-divider class="my-0" thickness="6" color="amber darken-3" />

    
 <div class="background page-container">
    <v-container>
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Mes Rapports de bataille</h2>
      <p class="text-body-1 text-center mb-6">
        Redécouvrez les derniers récits de batailles que vous avez vécu.
      </p>
      <BattleReportCards 
        :reports="reports" 
        display-mode="carousel"
        :show-actions="false"
        :items-per-page="3"
      />
    </v-container>
  </div>
    <v-divider class="my-0" thickness="6" color="amber darken-3" />

    
<v-container 
  fluid
  class="d-flex align-center justify-center news-section"
>
  <v-row justify="center" align="center" class="pa-8 news-content">
    <v-col cols="12" md="8">
      <h2 class="text-h4 font-weight-bold mb-4">Actualités Warhammer: The Old World</h2>
      <p class="mb-6 news-description">
        Suivez les dernières annonces officielles, mises à jour de règles, sorties de figurines et scénarios spéciaux proposés par Games Workshop.
      </p>
      <v-btn
        large
        href="https://www.warhammer-community.com/tag/the-old-world/"
        target="_blank"
        class="news-button"
        @mouseover="(e) => e.currentTarget.style.backgroundColor = '#4b2d21'"
        @mouseleave="(e) => e.currentTarget.style.backgroundColor = '#332018'"
      >
        Voir les articles officiels
      </v-btn>
    </v-col>
  </v-row>
</v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBattleReportStore, battleReportUtils } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';
import { useAuthStore } from '@/stores/auth';
import BattleReportCards from '@/components/BattleReportCards.vue';

const router = useRouter();
const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();
const scenarioStore = useScenarioStore();
const authStore = useAuthStore();

const reports = ref([]);
const NoAlliance = 4;


function fetchReports() {
  return armyPhotoStore.getArmyPhoto()
    .then(() => armyNameStore.getArmyName())
    .then(() => allianceStore.getAlliance())
    .then(() => battleReportStore.fetchBattleReportByUserId(authStore.profile.id))
    .then(() => {
      reports.value = battleReportStore.battleReports.map(report => {
        const players = report.players?.map(p => ({
          name: p.playerName,
          allianceId: p.alliance_idAlliance,
          alliance: battleReportUtils.getAllianceName(allianceStore, p.alliance_idAlliance),
          army: battleReportUtils.getArmyName(armyNameStore, p.armyName_idArmyName),
          armyImage: battleReportUtils.getArmyImageUrl(armyPhotoStore, p.armyName_idArmyName),
          score: p.playerScore
        })) ?? [];

        const groupedAlliances = battleReportUtils.groupedByAlliance(players, NoAlliance);

        return {
          id: report.idBattleReport,
          title: report.nameBattleReport,
          description: report.descriptionBattleReport,
          scenario: battleReportUtils.getScenarioName(scenarioStore, report.scenario_idScenario),
          points: Number(report.armyPoints),
          faction: players[0]?.army || '',
          opponent: players[1]?.army || '',
          players,
          groupedAlliances
        };
      });
    })
    .catch(err => {
      console.error('Erreur lors de la récupération des rapports de bataille :', err);
    });
}

const siteNews = [
  {
    title: "Le Grand Cathay",
    description: "Miao Ying, la Reine-Dragon, est désormais disponible ! Détaillez vos meilleurs rapports de batailles avec cette nouvelle armée.",
    image: "/public/img/carrousel/carrousel1.webp"
  },
  {
    title: "Rapports de Batailles Fonctionnels",
    description: "Vous pouvez désormais créer et partager vos rapports de batailles avec des images et des détails sur les armées.",
    image: "/public/img/carrousel/carrousel2.jpg",
    button: {
      text: "Voir mes rapports",
      icon: "mdi-view-list",
      action: "navigate",
      target: "/allbattlereports"
    }
  },
  {
    title: "Vos retours comptent",
    description: "Vos retours sont précieux pour améliorer le site. Partagez vos idées et suggestions !",
    image: "/public/img/carrousel/carrousel3.jpg",
    button: {
      text: "Contactez-nous",
      icon: "mdi-email-outline",
      action: "navigate",
      target: "/contact"
    }
  },
]


const handleButtonClick = (button) => {
  if (button.action === 'navigate' && button.target) {
    router.push(button.target);
  } else if (button.action === 'external' && button.target) {
    window.open(button.target, '_blank');
  } else if (button.action === 'custom' && button.handler) {
    button.handler();
  }
};

onMounted(() => {
  Promise.all([
    armyPhotoStore.getArmyPhoto(),
    armyNameStore.getArmyName(),
    allianceStore.getAlliance(),
    scenarioStore.getScenario()
  ]).then(() => fetchReports());
});
</script>

<style scoped>
.text-justify {
  text-align: justify;
}

.v-btn {
  background-color: transparent !important;
  border-radius: 5%;
}

.v-btn:hover {
  background-color: #332018 !important;
}

.v-icon {
  color: #332018;
}


.carousel-text {
  color: #EBDEC2;
}


.carousel-button {
  background-color: #332018 !important;
  color: #EBDEC2 !important;
  border: none !important;
  border-radius: 4px !important;
  font-weight: 400 !important;
  padding: 8px 16px !important;
  text-transform: none !important;
  transition: all 0.2s ease-in-out !important;
  min-width: auto !important;
  height: auto !important;
}

.carousel-button:hover {
  background-color: #4b2d21 !important;
  transform: none !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

.carousel-button .v-icon {
  color: #EBDEC2 !important;
  font-size: 16px !important;
  margin-right: 4px !important;
}


@media (max-width: 768px) {
  .carousel-button {
    padding: 6px 12px !important;
    font-size: 0.9rem !important;
  }
  
  .carousel-button .v-icon {
    font-size: 14px !important;
  }
}

@media (max-width: 480px) {
  .carousel-button {
    padding: 5px 10px !important;
    font-size: 0.85rem !important;
  }
  
  .carousel-button .v-icon {
    font-size: 12px !important;
  }
}


.presentation-text {
  order: 2;
}

.presentation-image-col {
  order: 1;
  margin-bottom: 2rem;
}

.presentation-title {
  font-size: 2.5rem;
}

.presentation-image {
  background-image: url('/public/img/site/site1.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  width: 100%;
}


.news-section {
  min-height: 90vh;
  background-image: url('/img/Site/site2.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  color: white;
  text-align: center;
}

.news-content {
  background-color: rgba(0,0,0,0.55);
  border-radius: 12px;
  max-width: 900px;
  margin: 0 auto;
}

.news-description {
  font-size: 1.1rem;
}

.news-button {
  background-color: #332018;
  color: #EBDEC2;
  font-weight: 600;
  transition: background-color 0.3s ease;
}


@media (max-width: 1200px) {
  .presentation-image {
    height: 350px;
  }
}

@media (max-width: 960px) {
  .presentation-text {
    order: 1;
    margin-bottom: 2rem;
  }
  
  .presentation-image-col {
    order: 2;
    margin-bottom: 0;
  }
  
  .presentation-title {
    font-size: 2rem;
  }
  
  .presentation-image {
    height: 300px;
  }
  
  .news-content {
    margin: 1rem;
    padding: 2rem 1rem;
  }
  
  .news-description {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  
  .main-carousel {
    height: 50vh !important;
  }
  
  .presentation-image {
    height: 250px;
  }
  
  .news-section {
    min-height: 70vh;
  }
  
  .news-content {
    padding: 1.5rem 0.5rem;
  }
}

@media (max-width: 600px) {
  .presentation-title {
    font-size: 1.75rem;
  }
  
  .presentation-image {
    height: 200px;
  }
  
  .news-section {
    min-height: 60vh;
    border-radius: 8px 8px 0 0;
  }
  
  .news-content {
    border-radius: 8px;
  }
  
  .news-button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  
  .main-carousel {
    height: 45vh !important;
  }
  
  .presentation-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .text-body-1 {
    font-size: 0.95rem;
  }
  
  .presentation-image {
    height: 180px;
  }
}
</style>
