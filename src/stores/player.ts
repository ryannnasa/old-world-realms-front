import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Player = {
  name: string;
  faction: string;
  armyName?: string;
  points?: number;
};

export const usePlayerStore = defineStore('player', {
  state: () => ({ player: [] }),
  actions: {
    getPlayer() {
      fetch('http://localhost:8080/player')
        .then(res => res.json())
        .then(data => this.player = data)
        .catch(err => console.error('Erreur API: ', err));
    },
 addPlayer(player : Player) {
  return fetch('http://localhost:8080/player', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(player),
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la création du joueur');
      return res.json();
    });
}
  }})
