import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCompositionArmeeStore = defineStore('compositionArmee', {
    state: () => ({ compositionArmee: []}),
    actions: {
      getCompositionArmee() {
        fetch('http://localhost:8080/compositionarmee')
        .then(res => res.json())
        .then(data => this.compositionArmee = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
