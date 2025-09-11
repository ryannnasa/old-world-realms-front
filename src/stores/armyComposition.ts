import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useArmyCompositionStore = defineStore('armyComposition', {
    state: () => ({ armyComposition: []}),
    actions: {
      getArmyComposition() {
        fetch(`${api}armycomposition`)
        .then(res => res.json())
        .then(data => this.armyComposition = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
