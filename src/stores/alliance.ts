import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAllianceStore = defineStore('alliance', {
    state: () => ({ alliance: []}),
    actions: {
      getAlliance() {
        fetch('http://localhost:8080/alliance')
        .then(res => res.json())
        .then(data => this.alliance = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
