import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useTroopTypeStore = defineStore('troopType', {
    state: () => ({ troopType: []}),
    actions: {
      getTroopType() {
        fetch(`${api}trooptype`)
        .then(res => res.json())
        .then(data => this.troopType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
