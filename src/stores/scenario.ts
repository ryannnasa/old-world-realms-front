import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useScenarioStore = defineStore('scenario', {
    state: () => ({ scenario: []}),
    actions: {
      getPointsCasesScenario() {
        fetch('http://localhost:8080/scenario')
        .then(res => res.json())
        .then(data => this.scenario = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
