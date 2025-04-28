<template>
    <div class="background page-container">
      <v-container>
        <div class="title-wrapper">
          <v-card class="mb-4 title-container">
            <v-card-title class="text-center">{{ battleReport.title }}</v-card-title>
          </v-card>
        </div>
  
        <v-row class="battle-overview">
          <v-col cols="5">
            <v-card class="army-card">
              <div class="battle-image" :style="{ backgroundImage: `url(${battleReport.attacker.image})` }"></div>
              <v-card-text>
                <p class="army-name">{{ battleReport.attacker.army }}</p>
                <p class="army-composition">{{ battleReport.attacker.composition }}</p>
                <div class="score" :class="battleReport.attacker.score > battleReport.defender.score ? 'victory' : 'defeat'">
                  <p>{{ battleReport.attacker.score }}</p>
                  <span v-if="battleReport.attacker.score > battleReport.defender.score">Victoire</span>
                  <span v-if="battleReport.attacker.score < battleReport.defender.score">Défaite</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <v-col cols="2" class="vs-container">
            <p class="vs-text">VS</p>
          </v-col>
  
          <v-col cols="5">
            <v-card class="army-card">
              <div class="battle-image" :style="{ backgroundImage: `url(${battleReport.defender.image})` }"></div>
              <v-card-text>
                <p class="army-name">{{ battleReport.defender.army }}</p>
                <p class="army-composition">{{ battleReport.defender.composition }}</p>
                <div class="score" :class="battleReport.defender.score > battleReport.attacker.score ? 'victory' : 'defeat'">
                  <p>{{ battleReport.defender.score }}</p>
                  <span v-if="battleReport.defender.score > battleReport.attacker.score">Victoire</span>
                  <span v-if="battleReport.defender.score < battleReport.attacker.score">Défaite</span>                  
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <v-card class="mb-4 card-container description-card">
          <v-card-title>Description de la bataille</v-card-title>
          <v-card-text>
            <p>{{ battleReport.description }}</p>
          </v-card-text>
        </v-card>
  
        <v-card class="mb-4 card-container photos-card">
          <v-card-title>Photos</v-card-title>
          <v-card-text>
            <v-carousel>
              <v-carousel-item v-for="(photo, index) in battleReport.photos" :key="index" :src="photo"></v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const battleReport = ref({
    title: "Bataille épique à Middenheim",
    description: "Une grande bataille s'est déroulée entre les forces de Bretonnie et les Hommes-Bêtes dans les terres sauvages autour de Middenheim.",
    photos: ["/img/Bretonniens/BREChevaliersDuGraal01.jpg", "/img/Bretonniens/BREChevaliersDuGraal02.jpg"],
    attacker: {
      name: "Chevalier Roland",
      army: "Kingdom of Bretonnia",
      composition: "Cavalerie lourde",
      score: 35,
      image: "/img/armees/kingdom-of-bretonnia.png"
    },
    defender: {
      name: "Chaman Gorthar",
      army: "Beastmen",
      composition: "Harde sauvage",
      score: 28,
      image: "/img/armees/tow-beastmen.png"
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
  }
  
  .title-wrapper {
    text-align: center;
    display: flex;
    justify-content: center;
  }
  
  .title-container, .card-container, .description-card, .photos-card {
    text-align: center;
    background-color: #332018;
    color: #EBDEC2;
    padding: 10px;
    border-radius: 10px;
    min-width: 200px; /* Optional, guarantees a minimum width */
  }
  
  .battle-overview {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .army-card {
    background-color: #332018;
    color: #EBDEC2;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
  }
  
  .battle-image {
    width: 100%;
    max-width: 400px;
    height: 300px;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
  }
  
  .army-name {
    font-size: 18px;
    font-weight: bold;
  }
  
  .army-composition {
    font-size: 14px;
  }
  
  .score {
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;
  }
  
  .victory {
    background-color: green;
    color: white;
  }
  
  .defeat {
    background-color: red;
    color: white;
  }
  
  .vs-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .vs-text {
    font-size: 30px;
    font-weight: bold;
    color: #211510; /* Marron foncé */
  }
  </style>
  