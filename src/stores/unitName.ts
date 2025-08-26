import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useUnitNameStore = defineStore('unitName', {
    state: () => ({ unitName: []}),
    actions: {
      getUnitName() {
        fetch(`${api}unitname`)
        .then(res => res.json())
        .then(data => this.unitName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
