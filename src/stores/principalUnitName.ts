import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const usePrincipalUnitNameStore = defineStore('principalUnitName', {
    state: () => ({ principalUnitName: []}),
    actions: {
      getPrincipalUnitName() {
        fetch(`${api}principalunitname`)
        .then(res => res.json())
        .then(data => this.principalUnitName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
