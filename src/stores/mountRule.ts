import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMountRuleStore = defineStore('mountRule', {
    state: () => ({ mountRule: []}),
    actions: {
      getMountRule() {
        fetch('${api}mountrule')
        .then(res => res.json())
        .then(data => this.mountRule = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
