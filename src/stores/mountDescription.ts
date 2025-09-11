import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMountDescriptionStore = defineStore('mountDescription', {
    state: () => ({ mountDescription: []}),
    actions: {
      getMountDescription() {
        fetch(`${api}mountdescription`)
        .then(res => res.json())
        .then(data => this.mountDescription = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
