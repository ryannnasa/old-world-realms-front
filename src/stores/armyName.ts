import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArmyNameStore = defineStore('armyName', {
    state: () => ({ armyName: []}),
    actions: {
      getArmyName() {
        fetch('http://localhost:8080/armyname')
        .then(res => res.json())
        .then(data => this.armyName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
