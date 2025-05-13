import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArmyPhotoStore = defineStore('armyPhoto', {
    state: () => ({ armyPhoto: []}),
    actions: {
      getArmyPhoto() {
        fetch('http://localhost:8080/armyphoto')
        .then(res => res.json())
        .then(data => this.armyPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
