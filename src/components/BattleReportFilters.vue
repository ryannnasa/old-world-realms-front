<template>
  <v-card class="mb-4 card-container">
    <v-card-title class="filter-title" @click="toggleFilters">
      Filtres
      <v-spacer></v-spacer>
      <v-btn icon class="filter-toggle-btn" @click.stop="toggleFilters">
        <v-icon>{{ showFilters ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-show="showFilters || !isMobile" class="filter-content">
      <v-row>
        <v-col cols="12" md="3">
          <v-select 
            v-model="localSelectedFaction" 
            :items="factions" 
            label="Armée jouée" 
            outlined
            @update:model-value="updateFaction"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select 
            v-model="localSelectedOpponent" 
            :items="opponents" 
            label="Armée Adverse" 
            outlined
            @update:model-value="updateOpponent"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select 
            v-model="localSelectedScenario" 
            :items="scenarios" 
            label="Scénario" 
            outlined
            @update:model-value="updateScenario"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field 
            v-model="localSelectedPoints" 
            label="Points" 
            type="number" 
            outlined 
            clearable
            @update:model-value="updatePoints"
          ></v-text-field>
          <div class="chip-container">
            <v-chip class="points-chip" @click="setPoints(500)">500</v-chip>
            <v-chip class="points-chip" @click="setPoints(1000)">1000</v-chip>
            <v-chip class="points-chip" @click="setPoints(1500)">1500</v-chip>
            <v-chip class="points-chip" @click="setPoints(2000)">2000</v-chip>
            <v-chip class="points-chip d-none d-lg-inline-flex" @click="setPoints(3000)">3000</v-chip>
          </div>
        </v-col>
      </v-row>

      <v-btn text class="reset-button" @click="resetFilters">
        Réinitialiser les filtres
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  factions: string[];
  opponents: string[];
  scenarios: string[];
  selectedFaction: string;
  selectedOpponent: string;
  selectedScenario: string;
  selectedPoints: number | null;
}

interface Emits {
  (e: 'update:selectedFaction', value: string): void;
  (e: 'update:selectedOpponent', value: string): void;
  (e: 'update:selectedScenario', value: string): void;
  (e: 'update:selectedPoints', value: number | null): void;
  (e: 'reset-filters'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showFilters = ref(false);
const isMobile = ref(false);

// Variables locales pour le v-model
const localSelectedFaction = ref(props.selectedFaction);
const localSelectedOpponent = ref(props.selectedOpponent);
const localSelectedScenario = ref(props.selectedScenario);
const localSelectedPoints = ref(props.selectedPoints);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 960;
  if (!isMobile.value) {
    showFilters.value = true;
  } else {
    showFilters.value = false;
  }
};

const toggleFilters = () => {
  if (isMobile.value) {
    showFilters.value = !showFilters.value;
  }
};

const updateFaction = (value: string) => {
  localSelectedFaction.value = value;
  emit('update:selectedFaction', value);
};

const updateOpponent = (value: string) => {
  localSelectedOpponent.value = value;
  emit('update:selectedOpponent', value);
};

const updateScenario = (value: string) => {
  localSelectedScenario.value = value;
  emit('update:selectedScenario', value);
};

const updatePoints = (value: string | number | null) => {
  const numValue = value === '' || value === null ? null : Number(value);
  localSelectedPoints.value = numValue;
  emit('update:selectedPoints', numValue);
};

const setPoints = (points: number) => {
  localSelectedPoints.value = points;
  emit('update:selectedPoints', points);
};

const resetFilters = () => {
  localSelectedFaction.value = '';
  localSelectedOpponent.value = '';
  localSelectedScenario.value = '';
  localSelectedPoints.value = null;
  emit('reset-filters');
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
.card-container {
  border-radius: 15px;
  background-color: #332018;
  color: #EBDEC2;
}

.filter-title {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px 20px !important;
}

.filter-toggle-btn {
  display: none;
}

.filter-content {
  transition: all 0.3s ease-in-out;
}

.reset-button {
  display: block;
  margin-top: 10px;
  color: #332018;
  border: 1px solid #EBDEC2;
  background-color: #EBDEC2;
}

.reset-button:hover {
  background-color: #EBDEC2;
  color: #332018;
}

.chip-container {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.points-chip {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
}

/* Responsive Design */
@media (max-width: 960px) {
  .filter-title {
    user-select: none;
  }  
  .filter-toggle-btn {
    display: inline-flex !important;
  }  
  .filter-content {
    overflow: hidden;
  }

  @media (min-width: 601px) {
    .points-chip {
      border-radius: 16px !important;
      font-weight: 500 !important;
      line-height: 1 !important;
      letter-spacing: 0.5px !important;
    }    
    .points-chip .v-chip__content {
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 100% !important;
    }
  }
}

@media (min-width: 960px) {
  .points-chip {
    flex: 1;
    min-width: 90px;
    font-size: 20px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    padding: 0 14px !important;
  }
}

@media (min-width: 1351px) {
  .points-chip {
    flex: none !important;
    min-width: 48px !important;
    max-width: 53px !important;
    font-size: 12px !important;
    height: 28px !important;
    padding: 0 4px !important;
  }  
  .chip-container {
    gap: 3px;
    justify-content: flex-start;
  }
}

@media (max-width: 1350px) {
  .points-chip {
    font-size: 12px !important;
    height: 28px !important;
    min-width: 45px !important;
    max-width: 50px !important;
    flex: none !important;
    padding: 0 4px !important;
  }  
  .chip-container {
    gap: 3px;
    justify-content: flex-start;
  }
}

@media (max-width: 1200px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 38px !important;
    max-width: 43px !important;
    flex: none !important;
    padding: 0 3px !important;
  }  
  .chip-container {
    gap: 2px;
    justify-content: flex-start;
  }
}

@media (min-width: 1200px) and (max-width: 1280px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 36px !important;
    max-width: 40px !important;
    flex: none !important;
    padding: 0 2px !important;
  }  
  .chip-container {
    gap: 1px;
    justify-content: flex-start;
  }
}

@media (min-width: 960px) and (max-width: 1199px) {
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 37px !important;
    max-width: 42px !important;
    flex: none !important;
    padding: 0 3px !important;
  }  
  .chip-container {
    gap: 2px;
    justify-content: flex-start;
  }
}

@media (max-width: 959px) {
  .points-chip {
    font-size: 16px !important;
    height: 36px !important;
    min-width: 80px !important;
    max-width: 80px !important;
    flex: none !important;
    padding: 0 8px !important;
    border-radius: 18px !important;
  }  
  .points-chip .v-chip__content {
    font-size: 16px !important;
    line-height: 36px !important;
  } 
  .chip-container {
    gap: 8px;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .chip-container {
    flex-wrap: nowrap;
    gap: 2px;
    justify-content: flex-start;
  } 
  .points-chip {
    font-size: 10px !important;
    height: 24px !important;
    min-width: 42px !important;
    max-width: 42px !important;
    flex: none !important;
    padding: 0 2px !important;
    border-radius: 12px !important;
  } 
  .points-chip .v-chip__content {
    font-size: 10px !important;
    line-height: 24px !important;
  }
}

@media (max-width: 480px) {
  .chip-container {
    gap: 3px !important;
    justify-content: flex-start !important;
  }  
  .points-chip {
    font-size: 12px !important;
    height: 28px !important;
    min-width: 45px !important;
    max-width: 45px !important;
    flex: none !important;
    padding: 0 3px !important;
    border-radius: 14px !important;
  }  
  .points-chip .v-chip__content {
    font-size: 12px !important;
    line-height: 28px !important;
    padding: 0 !important;
  }
}
</style>
