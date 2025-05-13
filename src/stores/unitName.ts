import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUnitNameStore = defineStore('unitName', {
    state: () => ({ unitName: []}),
    actions: {
      getUnitName() {
        fetch('http://localhost:8080/unitname')
        .then(res => res.json())
        .then(data => this.unitName = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
