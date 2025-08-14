<template>
  <v-row v-if="displayMode === 'grid'">
    <v-col
      v-for="report in reports"
      :key="report.id"
      cols="12"
      md="6"
      lg="4"
    >
      <v-card class="card-container battle-card" hover>
        <div class="action-buttons" v-if="showActions">
          <v-btn class="button" icon small @click.stop="editReport(report.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="button" icon small @click.stop="promptDelete(report.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <router-link :to="`/battlereportview/${report.id}`" style="text-decoration: none; color: inherit;">
          <div class="battle-images-container">
            <template v-if="report.players.length > 4">
              <div class="battle-image full" :style="{ backgroundImage: 'url(/img/armees/tow-battle.png)' }"></div>
            </template>
            <template v-else>
              <div
                v-for="(alliance, index) in report.groupedAlliances"
                :key="index"
                class="battle-image"
                :style="{ width: 100 / report.groupedAlliances.length + '%' }"
              >
                <div
                  v-for="player in alliance"
                  :key="player.name"
                  class="player-image"
                  :title="player.army"
                  :style="{
                    backgroundImage: player.armyImage ? `url('${player.armyImage}')` : 'url(/path/to/default/image.png)',
                    width: 100 / alliance.length + '%'
                  }"
                ></div>
              </div>
            </template>
          </div>

          <v-card-title class="mt-2">{{ report.title }}</v-card-title>

          <v-card-subtitle class="d-flex align-center justify-center flex-wrap text-center">
            <template v-for="(alliance, index) in report.groupedAlliances" :key="index">
              <span class="mx-1 font-weight-medium">
                {{ alliance.map(player => player.name).join(' / ') }}
              </span>
              <v-icon
                v-if="index < report.groupedAlliances.length - 1"
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
    </v-col>
  </v-row>

  <div v-else-if="displayMode === 'carousel'" class="carousel-wrapper d-flex justify-center align-center mb-4">
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
                        v-for="(alliance, index) in report.groupedAlliances"
                        :key="index"
                        class="battle-image"
                        :style="{ width: 100 / report.groupedAlliances.length + '%' }"
                      >
                        <div
                          v-for="player in alliance"
                          :key="player.name"
                          class="player-image"
                          :title="player.army"
                          :style="{
                            backgroundImage: player.armyImage ? `url('${player.armyImage}')` : 'url(/img/armees/tow-battle.png)',
                            width: 100 / alliance.length + '%'
                          }"
                        ></div>
                      </div>
                    </template>
                  </div>

                  <v-card-title class="mt-2 battle-title">{{ report.title }}</v-card-title>

                  <v-card-subtitle class="d-flex align-center justify-center flex-wrap text-center battle-subtitle">
                    <template v-for="(alliance, index) in report.groupedAlliances" :key="index">
                      <span class="mx-1 font-weight-medium">
                        {{ alliance.map(player => player.name).join(' / ') }}
                      </span>
                      <v-icon
                        v-if="index < report.groupedAlliances.length - 1"
                        class="mx-2"
                        color="grey"
                      >
                        mdi-sword-cross
                      </v-icon>
                    </template>
                  </v-card-subtitle>

                  <v-card-text class="battle-points">{{ report.points }} points</v-card-text>
                </router-link>
              </v-card>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Player {
  name: string;
  allianceId: number;
  alliance: string;
  army: string;
  armyImage: string;
  score: number;
}

interface BattleReport {
  id: number;
  title: string;
  description: string;
  scenario: string;
  points: number;
  faction: string;
  opponent: string;
  players: Player[];
  groupedAlliances: Player[][];
}

interface Props {
  reports: BattleReport[];
  displayMode?: 'grid' | 'carousel';
  showActions?: boolean;
  itemsPerPage?: number;
}

interface Emits {
  (e: 'edit-report', id: number): void;
  (e: 'delete-report', id: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: 'grid',
  showActions: true,
  itemsPerPage: 3
});

const emit = defineEmits<Emits>();

const currentPage = ref(0);

const chunkedReports = computed(() => {
  if (props.displayMode === 'carousel') {
    const chunks = [];
    for (let i = 0; i < props.reports.length; i += props.itemsPerPage) {
      chunks.push(props.reports.slice(i, i + props.itemsPerPage));
    }
    return chunks;
  }
  return [];
});

const editReport = (id: number) => {
  emit('edit-report', id);
};

const promptDelete = (id: number) => {
  emit('delete-report', id);
};
</script>

<style scoped>
.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

.button {
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

.action-buttons {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  gap: 4px;
  z-index: 2;
}

.battle-card:hover .action-buttons {
  display: flex;
}

.battle-images-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.battle-image {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100%;
  image-rendering: auto;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  display: flex;
}

.battle-image.full {
  width: 100%;
}

.player-image {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media (min-width: 769px) {
  .battle-images-container {
    height: 200px;
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .battle-images-container {
    height: 165px !important;
  }
}

@media (max-width: 768px) {
  .battle-images-container {
    height: 160px !important;
  }
}

@media (max-width: 600px) {
  .battle-images-container {
    height: 160px !important;
  }
  .v-card-title {
    font-size: 1.1rem !important;
    padding: 10px 12px !important;
  }  
  .v-card-subtitle {
    font-size: 0.9rem !important;
    padding: 6px 12px !important;
  }  
  .v-card-text {
    padding: 6px 12px 10px 12px !important;
  }
}

@media (max-width: 480px) {
  .battle-images-container {
    height: 140px !important;
  }
  .v-card-title {
    font-size: 0.95rem !important;
    padding: 6px 8px !important;
    line-height: 1.2 !important;
  }  
  .v-card-subtitle {
    font-size: 0.8rem !important;
    padding: 3px 8px !important;
    line-height: 1.1 !important;
  } 
  .v-card-text {
    padding: 3px 8px 6px 8px !important;
    font-size: 0.85rem !important;
  }
}

.carousel-wrapper {
  gap: 16px;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  max-width: 1200px;
}

.carousel-item {
  flex: 0 0 calc(100% / 3);
  padding: 8px;
}

.battle-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.battle-subtitle {
  font-size: 0.9rem;
}

.battle-points {
  font-size: 0.9rem;
}

@media (max-width: 1200px) {
  .carousel-item {
    flex: 0 0 calc(100% / 2);
  }
}

@media (max-width: 768px) {
  .carousel-item {
    flex: 0 0 100%;
    padding: 4px;
  }
  
  .battle-title {
    font-size: 1rem;
  }
  
  .battle-subtitle {
    font-size: 0.85rem;
  }
  
  .battle-points {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .carousel-item .battle-title {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
  
  .carousel-item .battle-subtitle {
    font-size: 0.8rem;
    padding: 4px 12px;
  }
  
  .carousel-item .battle-points {
    font-size: 0.85rem;
    padding: 4px 12px 12px;
  }
}
</style>
