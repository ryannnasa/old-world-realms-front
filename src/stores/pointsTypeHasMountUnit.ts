import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const usePointsTypeHasMountUnitStore = defineStore('pointsTypeHasMountUnit', {
    state: () => ({ pointsTypeHasMountUnit: []}),
    actions: {
      getPointsTypeHasMountUnit() {
        fetch(`${api}pointstypehasmountunit`)
        .then(res => res.json())
        .then(data => this.pointsTypeHasMountUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
