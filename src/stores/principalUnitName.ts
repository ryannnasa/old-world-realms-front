import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePrincipalUnitNameStore = defineStore('principalUnitName', {
    state: () => ({ principalUnitName: []}),
    actions: {
      getPrincipalUnitName() {
        fetch('http://localhost:8080/principalunitname')
        .then(res => res.json())
        .then(data => this.principalUnitName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
