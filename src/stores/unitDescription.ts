import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useUnitDescriptionStore = defineStore('unitDescription', {
    state: () => ({ unitDescription: []}),
    actions: {
      getUnitDescription() {
        fetch(`${api}unitdescription`)
        .then(res => res.json())
        .then(data => this.unitDescription = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
