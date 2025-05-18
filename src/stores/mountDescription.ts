import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMountDescriptionStore = defineStore('mountDescription', {
    state: () => ({ mountDescription: []}),
    actions: {
      getMountDescription() {
        fetch('http://localhost:8080/mountdescription')
        .then(res => res.json())
        .then(data => this.mountDescription = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
