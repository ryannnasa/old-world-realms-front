import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({ player: []}),
    actions: {
      getPlayer() {
        fetch('http://localhost:8080/player')
        .then(res => res.json())
        .then(data => this.player = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
