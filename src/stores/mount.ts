import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMountStore = defineStore('mount', {
    state: () => ({ mount: []}),
    actions: {
      getMount() {
        fetch('http://localhost:8080/mount')
        .then(res => res.json())
        .then(data => this.mount = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
