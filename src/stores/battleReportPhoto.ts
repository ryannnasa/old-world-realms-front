import { ref } from 'vue'
import { defineStore } from 'pinia'

type BattleReportPhoto = {
  id?: number;
  idBattleReport: number;
  name: string;
  fileBattleReportPhoto?: File;
};

export const useBattleReportPhotoStore = defineStore('battleReportPhoto', {
  state: () => ({
    battleReportPhotos: [] }),
  actions: {
    getBattleReportPhotos() {
      fetch('http://localhost:8080/battlereportphoto')
        .then(res => res.json())
        .then(data => this.battleReportPhotos = data)
        .catch(err => console.error('Erreur API :', err));
    },

    addBattleReportPhoto(battleReportPhoto: BattleReportPhoto) {
      return fetch('http://localhost:8080/battlereportphoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(battleReportPhoto),
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors de l’ajout de la photo');
          return res.json();
        });
  }
}})
