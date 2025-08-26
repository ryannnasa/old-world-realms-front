import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useAttachedUnitStore = defineStore('attachedUnit', {
    state: () => ({ attachedUnit: []}),
    actions: {
      getAttachedUnit() {
        fetch('${api}attachedunit')
        .then(res => res.json())
        .then(data => this.attachedUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
