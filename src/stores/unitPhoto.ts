import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUnitPhotoStore = defineStore('unitPhoto', {
    state: () => ({ unitPhoto: []}),
    actions: {
      getUnitPhoto() {
        fetch('http://localhost:8080/unitphoto')
        .then(res => res.json())
        .then(data => this.unitPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
