import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useAllianceStore = defineStore('alliance', {
    state: () => ({ alliance: []}),
    actions: {
      getAlliance() {
        fetch(`${api}alliance`)
        .then(res => res.json())
        .then(data => this.alliance = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
