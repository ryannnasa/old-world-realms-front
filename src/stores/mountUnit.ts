import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMountUnitStore = defineStore('mountUnit', {
    state: () => ({ mountUnit: []}),
    actions: {
      getMountUnit() {
        fetch(`${api}mountunit`)
        .then(res => res.json())
        .then(data => this.mountUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
