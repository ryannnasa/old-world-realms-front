import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useArmyPhotoStore = defineStore('armyPhoto', {
  state: () => ({
    armyPhoto: []
  }),
  actions: {
    getArmyPhoto() {
      return fetch(`${api}armyphoto`)
        .then(res => res.json())
        .then(data => {
          this.armyPhoto = data;
        })
        .catch(err => console.error('Erreur API: ', err));
    },
  },
});
