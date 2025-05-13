import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUnitStore = defineStore('unit', {
    state: () => ({ unit: []}),
    actions: {
      getUnit() {
        fetch('http://localhost:8080/unit')
        .then(res => res.json())
        .then(data => this.unit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
