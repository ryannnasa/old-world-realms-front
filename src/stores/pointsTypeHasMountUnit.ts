import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePointsTypeHasMountUnitStore = defineStore('pointsTypeHasMountUnit', {
    state: () => ({ pointsTypeHasMountUnit: []}),
    actions: {
      getPointsTypeHasMountUnit() {
        fetch('http://localhost:8080/pointstypehasmountunit')
        .then(res => res.json())
        .then(data => this.pointsTypeHasMountUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
