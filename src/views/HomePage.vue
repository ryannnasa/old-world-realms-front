<template>
  <v-container fluid class="pa-0">
    <!-- 1. Carrousel principal -->
    <v-carousel
      hide-delimiter-background
      show-arrows-on-hover
      cycle
      height="100vh"
      class="rounded-0"
    >
      <v-carousel-item
        v-for="(item, i) in siteNews"
        :key="i"
      >
        <v-img :src="item.image" height="100%" cover>
          <div class="d-flex align-center justify-center fill-height text-center">
            <div class="white--text px-6">
              <h2 class="text-h3 font-weight-bold mb-4">{{ item.title }}</h2>
              <p class="text-subtitle-1">{{ item.description }}</p>
            </div>
          </div>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <v-divider class="my-0" thickness="6" color="amber darken-3" />

    <!-- 2. Présentation du site -->
<v-container class="py-16" style="min-height: 80vh;">
  <v-row justify="space-between" align="center" style="flex-wrap: nowrap;">
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

    <!-- 3. Rapports de bataille récents -->
 <div class="background page-container">
    <v-container>
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Mes Rapports de bataille</h2>
      <p class="text-body-1 text-center mb-6">
        Redécouvrez les derniers récits de batailles que vous avez vécu.
      </p>
      <div class="carousel-wrapper d-flex justify-center align-center mb-4">
        <div class="carousel-container">
          <v-window v-model="currentPage" show-arrows continuous>

            <v-window-item
              v-for="(chunk, index) in chunkedReports"
              :key="index"
              :value="index"
            >
              <div class="d-flex">
                <div
                  v-for="report in chunk"
                  :key="report.id"
                  class="carousel-item"
                >
                  <v-card class="card-container battle-card" hover>
                    <router-link :to="`/battlereportview/${report.id}`" style="text-decoration: none; color: inherit;">
                      <div class="battle-images-container">
                        <template v-if="report.players.length > 4">
                          <div class="battle-image full" :style="{ backgroundImage: 'url(/img/armees/tow-battle.png)' }"></div>
                        </template>
                        <template v-else>
                          <div
                            v-for="(alliance, index) in groupedByAlliance(report.players)"
                            :key="index"
                            class="battle-image alliance-group"
                            :style="{ width: 100 / groupedByAlliance(report.players).length + '%' }"
                          >
                            <div
                              v-for="player in alliance"
                              :key="player.name"
                              class="player-image"
                              :title="player.army"
                              :style="{ backgroundImage: `url('${player.armyImage}')` }"
                            ></div>
                          </div>
                        </template>
                      </div>

                      <v-card-title class="mt-2">{{ report.title }}</v-card-title>

                      <v-card-subtitle class="d-flex align-center justify-center flex-wrap text-center">
                        <template v-for="(alliance, index) in groupedByAlliance(report.players)" :key="index">
                          <span class="mx-1 font-weight-medium">
                            {{ alliance.map(player => player.name).join(' / ') }}
                          </span>
                          <v-icon
                            v-if="index < groupedByAlliance(report.players).length - 1"
                            class="mx-2"
                            color="grey"
                          >
                            mdi-sword-cross
                          </v-icon>
                        </template>
                      </v-card-subtitle>

                      <v-card-text>{{ report.points }} points</v-card-text>
                    </router-link>
                  </v-card>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </div>

      </div>
    </v-container>
  </div>
    <v-divider class="my-0" thickness="6" color="amber darken-3" />

    <!-- 4. Actualités Warhammer Community -->
<v-container 
  fluid
  class="d-flex align-center justify-center"
  style="
    min-height: 90vh;
    background-image: url('/img/Site/site2.jpg');
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    color: white;
    text-align: center;
  "
>
  <v-row justify="center" align="center" class="pa-8" style="background-color: rgba(0,0,0,0.55); border-radius: 12px; max-width: 900px;">
    <v-col cols="12" md="8">
      <h2 class="text-h4 font-weight-bold mb-4">Actualités Warhammer: The Old World</h2>
      <p class="mb-6" style="font-size: 1.1rem;">
        Suivez les dernières annonces officielles, mises à jour de règles, sorties de figurines et scénarios spéciaux proposés par Games Workshop.
      </p>
      <v-btn
        large
        href="https://www.warhammer-community.com/en-gb/setting/warhammer-the-old-world/"
        target="_blank"
        style="
          background-color: #332018;
          color: #EBDEC2;
          font-weight: 600;
          transition: background-color 0.3s ease;
        "
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
import { ref, onMounted, computed } from 'vue';
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';
import { useScenarioStore } from '@/stores/scenario';
import _ from 'lodash';

const battleReportStore = useBattleReportStore();
const armyPhotoStore = useArmyPhotoStore();
const armyNameStore = useArmyNameStore();
const allianceStore = useAllianceStore();
const scenarioStore = useScenarioStore();

const reports = ref([]);
const NoAlliance = 4;
const reportsPerPage = 6;
const currentPage = ref(0);

reports.value = [];

const chunkedReports = computed(() => {
  const chunks = [];
  for (let i = 0; i < reports.value.length; i += 3) {
    chunks.push(reports.value.slice(i, i + 3));
  }
  return chunks;
});

const totalPages = computed(() => Math.ceil(reports.value.length / reportsPerPage));

const pagedReports = computed(() => {
  const start = (currentPage.value - 1) * reportsPerPage;
  return reports.value.slice(start, start + reportsPerPage);
});

function prevPage() {
  currentPage.value = currentPage.value > 1 ? currentPage.value - 1 : totalPages.value;
}

function nextPage() {
  currentPage.value = currentPage.value < totalPages.value ? currentPage.value + 1 : 1;
}

function groupedByAlliance(players) {
  const groupedObj = _.groupBy(players, player => {
    if (!player.allianceId || player.allianceId === NoAlliance) {
      return `no-alliance-${player.name}`;
    }
    return player.allianceId;
  });

  const groups = Object.values(groupedObj);
  const firstPlayer = players[0];
  const firstGroupKey = (!firstPlayer.allianceId || firstPlayer.allianceId === NoAlliance)
    ? `no-alliance-${firstPlayer.name}`
    : firstPlayer.allianceId;

  const sortedGroups = [];

  if (groupedObj[firstGroupKey]) {
    sortedGroups.push(groupedObj[firstGroupKey]);
    delete groupedObj[firstGroupKey];
  }
  for (const group of Object.values(groupedObj)) {
    sortedGroups.push(group);
  }

  return sortedGroups;
}

function getArmyImageUrl(armyId) {
  const photo = armyPhotoStore.armyPhoto.find(p => p.armyName_idArmyName === armyId);
  return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/tow-battle.png';
}

function getArmyName(armyId) {
  const army = armyNameStore.armyName.find(a => a.idArmyName === armyId);
  return army ? army.nameArmyName : 'Inconnu';
}

function getAllianceName(allianceId) {
  const alliance = allianceStore.alliance.find(a => a.idAlliance === allianceId);
  return alliance ? alliance.nameAlliance : 'Aucune';
}

function getScenarioName(scenarioId) {
  const scenario = scenarioStore.scenario.find(s => s.idScenario === scenarioId);
  return scenario ? scenario.scenarioName : 'Inconnu';
}

function fetchReports() {
  return battleReportStore.getBattleReport().then(() => {
    reports.value = battleReportStore.battleReports.map(report => {
      const players = report.players?.map(p => ({
        name: p.playerName,
        allianceId: p.alliance_idAlliance,
        alliance: getAllianceName(p.alliance_idAlliance),
        army: getArmyName(p.armyName_idArmyName),
        armyImage: getArmyImageUrl(p.armyName_idArmyName),
        score: p.playerScore
      })) ?? [];

      return {
        id: report.idBattleReport,
        title: report.nameBattleReport,
        description: report.descriptionBattleReport,
        scenario: getScenarioName(report.scenario_idScenario),
        points: Number(report.armyPoints),
        players
      };
    });
  });
}

const articles = [
  {
    title: "The Old World: A new beginning",
    summary: "Découvrez le retour épique de Warhammer: The Old World avec de nouvelles factions, règles et histoires.",
    image: "https://www.warhammer-community.com/wp-content/uploads/2023/06/old-world-banner.jpg",
    link: "https://www.warhammer-community.com/2023/06/12/the-old-world-a-new-beginning/"
  },
  {
    title: "Factions revealed: Skaven",
    summary: "Tout savoir sur les Skavens et leur influence sournoise dans le Vieux Monde.",
    image: "https://www.warhammer-community.com/wp-content/uploads/2023/06/skaven-banner.jpg",
    link: "https://www.warhammer-community.com/2023/06/15/factions-revealed-skaven/"
  },
  {
    title: "Upcoming scenarios for Warhammer: The Old World",
    summary: "Préparez-vous aux nouveaux scénarios qui viendront enrichir vos parties et campagnes.",
    image: "https://www.warhammer-community.com/wp-content/uploads/2023/06/scenario-banner.jpg",
    link: "https://www.warhammer-community.com/2023/06/20/upcoming-scenarios/"
  }
];

const siteNews = [
  {
    title: "Nouveaux rapports disponibles",
    description: "La campagne des Pierres des Hardes continue, découvrez les derniers affrontements !",
    image: "/public/img/carrousel/carrousel1.webp",
  },
  {
    title: "Codex Skaven mis à jour",
    description: "Les règles Skaven complètes sont désormais en ligne.",
    image: "/public/img/carrousel/carrousel2.jpg",
  },
  {
    title: "Créateur de listes amélioré",
    description: "Ajoutez vos héros personnalisés et imprimez vos listes plus facilement.",
    image: "/public/img/carrousel/carrousel3.jpg",
  },
]

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

.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

.battle-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.battle-card:hover {
  transform: scale(1.02);
  image-rendering: auto;
}

.battle-images-container {
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.battle-image {
  flex: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100%;
  image-rendering: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

.battle-image.full {
  width: 100%;
}

.battle-image.alliance-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.player-image {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  margin: 0 2px;
}

.vs-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 4px;
  color: #EBDEC2;
}

.battle-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.battle-details {
  font-size: 0.9rem;
  opacity: 0.8;
}

.carousel-wrapper {
  gap: 16px;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  max-width: 1200px;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-item {
  flex: 0 0 calc(100% / 3);
  padding: 8px;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
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
</style>
