import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainTroopTypeStore = defineStore('mainTroopType', {
    state: () => ({ mainTroopType: []}),
    actions: {
      getMainTroopType() {
        fetch('http://localhost:8080/maintrooptype')
        .then(res => res.json())
        .then(data => this.mainTroopType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
