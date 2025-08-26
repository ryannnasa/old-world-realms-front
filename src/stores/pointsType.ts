import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const usePointsTypeStore = defineStore('pointsType', {
    state: () => ({ pointsType: []}),
    actions: {
      getPointsType() {
        fetch('${api}pointstype')
        .then(res => res.json())
        .then(data => this.pointsType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
