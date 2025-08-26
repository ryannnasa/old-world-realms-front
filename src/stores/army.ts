import { defineStore } from 'pinia'
import { api } from '@/utils/api';

export const useArmyStore = defineStore('army', {
  state: () => ({
    army: []
  }),
  actions: {
    async getArmy() {
      try {
        const response = await fetch('${api}army');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.army = data;
        console.log('Data loaded in Army Store:', this.army);
      } catch (error) {
        console.error('Erreur API: ', error);
      }
    }
  }
});
