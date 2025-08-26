import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useArmyNameStore = defineStore('armyName', {
    state: () => ({ armyName: []}),
    actions: {
      getArmyName() {
        fetch(`${api}armyname`)
        .then(res => res.json())
        .then(data => this.armyName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
