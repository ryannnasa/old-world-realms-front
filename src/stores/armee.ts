import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useArmeeStore = defineStore('armee', {
    state: () => ({ armee: []}),
    actions: {
      getArmee() {
        fetch('http://localhost:8080/nomarmee')
        .then(res => res.json())
        .then(data => this.armee = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
