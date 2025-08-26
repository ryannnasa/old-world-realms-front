import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const usePointsTypeHasUnitStore = defineStore('pointsTypeHasUnit', {
    state: () => ({ pointsTypeHasUnit: []}),
    actions: {
      getPointsTypeHasUnit() {
        fetch(`${api}pointstypehasunit`)
        .then(res => res.json())
        .then(data => this.pointsTypeHasUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
