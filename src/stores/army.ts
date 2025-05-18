import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArmyStore = defineStore('army', {
    state: () => ({ army: []}),
    actions: {
      getArmy() {
        fetch('http://localhost:8080/army')
        .then(res => res.json())
        .then(data => this.army = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
