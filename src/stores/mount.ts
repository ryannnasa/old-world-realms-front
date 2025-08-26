import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMountStore = defineStore('mount', {
    state: () => ({ mount: []}),
    actions: {
      getMount() {
        fetch('${api}mount')
        .then(res => res.json())
        .then(data => this.mount = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
