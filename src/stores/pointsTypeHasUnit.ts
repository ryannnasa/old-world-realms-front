import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePointsTypeHasUnitStore = defineStore('pointsTypeHasUnit', {
    state: () => ({ pointsTypeHasUnit: []}),
    actions: {
      getPointsTypeHasUnit() {
        fetch('http://localhost:8080/pointstypehasunit')
        .then(res => res.json())
        .then(data => this.pointsTypeHasUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
