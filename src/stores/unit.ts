import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useUnitStore = defineStore('unit', {
    state: () => ({ unit: []}),
    actions: {
      getUnit() {
        fetch(`${api}unit`)
        .then(res => res.json())
        .then(data => this.unit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
