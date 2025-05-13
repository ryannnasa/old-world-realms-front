import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePointsTypeStore = defineStore('pointsType', {
    state: () => ({ pointsType: []}),
    actions: {
      getPointsType() {
        fetch('http://localhost:8080/pointstype')
        .then(res => res.json())
        .then(data => this.pointsType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
