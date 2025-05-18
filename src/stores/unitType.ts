import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUnitTypeStore = defineStore('unitType', {
    state: () => ({ unitType: []}),
    actions: {
      getUnitType() {
        fetch('http://localhost:8080/unittype')
        .then(res => res.json())
        .then(data => this.unitType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
