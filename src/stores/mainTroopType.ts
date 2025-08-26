import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMainTroopTypeStore = defineStore('mainTroopType', {
    state: () => ({ mainTroopType: []}),
    actions: {
      getMainTroopType() {
        fetch(`${api}maintrooptype`)
        .then(res => res.json())
        .then(data => this.mainTroopType = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
