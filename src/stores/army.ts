import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useArmyStore = defineStore('army', {
  state: () => ({
    army: []
  }),
  actions: {
    async getArmy() {
      try {
        const response = await fetch('http://localhost:8080/army');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.army = data;
        console.log('Data loaded in Army Store:', this.army); // Log pour vérifier les données
      } catch (error) {
        console.error('Erreur API: ', error);
      }
    }
  }
});
