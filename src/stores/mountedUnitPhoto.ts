import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useMountedUnitPhotoStore = defineStore('mountedUnitPhoto', {
    state: () => ({ mountedUnitPhoto: []}),
    actions: {
      getMountUnitPhoto() {
        fetch('${api}mountedunitphoto')
        .then(res => res.json())
        .then(data => this.mountedUnitPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
