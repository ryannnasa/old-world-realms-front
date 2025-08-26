import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useUnitTypeStore = defineStore('unitType', {
    state: () => ({ unitType: []}),
    actions: {
      getUnitType() {
        fetch(`${api}unittype`)
        .then(res => res.json())
        .then(data => this.unitType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
