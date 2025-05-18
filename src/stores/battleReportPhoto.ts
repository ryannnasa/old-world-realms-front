import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBattleReportPhotoStore = defineStore('battleReportPhoto', {
    state: () => ({ battleReportPhoto: []}),
    actions: {
      getBattleReportPhoto() {
        fetch('http://localhost:8080/battlereportphoto')
        .then(res => res.json())
        .then(data => this.battleReportPhoto = data)
        .catch(err => console.error('Erreur API: ', err));
      },
    },
})
