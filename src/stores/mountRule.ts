import { defineStore } from 'pinia'

export const useMountRuleStore = defineStore('mountRule', {
    state: () => ({ mountRule: []}),
    actions: {
      getMountRule() {
        fetch('http://localhost:8080/mountrule')
        .then(res => res.json())
        .then(data => this.mountRule = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
