import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArmyCompositionStore = defineStore('armyComposition', {
    state: () => ({ armyComposition: []}),
    actions: {
      getArmyComposition() {
        fetch('http://localhost:8080/armycomposition')
        .then(res => res.json())
        .then(data => this.armyComposition = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
