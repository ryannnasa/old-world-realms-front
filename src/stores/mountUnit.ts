import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMountUnitStore = defineStore('mountUnit', {
    state: () => ({ mountUnit: []}),
    actions: {
      getMountUnit() {
        fetch('http://localhost:8080/mountunit')
        .then(res => res.json())
        .then(data => this.mountUnit = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
