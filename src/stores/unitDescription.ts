import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUnitDescriptionStore = defineStore('unitDescription', {
    state: () => ({ unitDescription: []}),
    actions: {
      getUnitDescription() {
        fetch('http://localhost:8080/unitdescription')
        .then(res => res.json())
        .then(data => this.unitDescription = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
