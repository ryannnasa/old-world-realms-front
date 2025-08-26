import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useScenarioStore = defineStore('scenario', {
    state: () => ({ scenario: []}),
    actions: {
      getScenario() {
        return fetch(`${api}scenario`)
        .then(res => res.json())
        .then(data => this.scenario = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
