import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTroopTypeStore = defineStore('troopType', {
    state: () => ({ troopType: []}),
    actions: {
      getTroopType() {
        fetch('http://localhost:8080/trooptype')
        .then(res => res.json())
        .then(data => this.troopType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
