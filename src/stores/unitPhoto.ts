import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'

export const useUnitPhotoStore = defineStore('unitPhoto', {
    state: () => ({ unitPhoto: []}),
    actions: {
      getUnitPhoto() {
        fetch(`${api}unitphoto`)
        .then(res => res.json())
        .then(data => this.unitPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
