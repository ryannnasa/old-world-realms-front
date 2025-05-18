import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAttachedUnitStore = defineStore('attachedUnit', {
    state: () => ({ attachedUnit: []}),
    actions: {
      getAttachedUnit() {
        fetch('http://localhost:8080/attachedunit')
        .then(res => res.json())
        .then(data => this.attachedUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
