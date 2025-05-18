import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePointsCasesStore = defineStore('pointsCases', {
    state: () => ({ pointsCases: []}),
    actions: {
      getPointsCases() {
        fetch('http://localhost:8080/pointscases')
        .then(res => res.json())
        .then(data => this.pointsCases = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
