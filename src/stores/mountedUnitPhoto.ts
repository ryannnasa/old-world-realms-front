import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMountedUnitPhotoStore = defineStore('mountedUnitPhoto', {
    state: () => ({ mountedUnitPhoto: []}),
    actions: {
      getMountUnitPhoto() {
        fetch('http://localhost:8080/mountedunitphoto')
        .then(res => res.json())
        .then(data => this.mountedUnitPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
