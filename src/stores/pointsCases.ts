import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const usePointsCasesStore = defineStore('pointsCases', {
    state: () => ({ pointsCases: []}),
    actions: {
      getPointsCases() {
        fetch(`${api}pointscases`)
        .then(res => res.json())
        .then(data => this.pointsCases = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
