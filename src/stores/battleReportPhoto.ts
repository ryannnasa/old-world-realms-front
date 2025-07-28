import { defineStore } from 'pinia'

export type BattleReportPhoto = {
  id?: number;
  idBattleReport: number;
  name: string;
  fileBattleReportPhoto?: File;
};

export const useBattleReportPhotoStore = defineStore('battleReportPhoto', {
  state: () => ({
    battleReportPhotos: [] as BattleReportPhoto[],
  }),

  actions: {
    getBattleReportPhotos() {
      return fetch('http://localhost:8080/battlereportphoto')
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors de la récupération des photos');
          return res.json();
        })
        .then(data => {
          this.battleReportPhotos = data;
        })
        .catch(err => {
          console.error('Erreur API :', err);
          throw err;
        });
    },

    addBattleReportPhoto(photo: BattleReportPhoto) {
      const formData = new FormData();
      formData.append('idBattleReport', String(photo.idBattleReport));
      formData.append('name', photo.name);
      if (photo.fileBattleReportPhoto) {
        formData.append('file', photo.fileBattleReportPhoto);
      }

      return fetch('http://localhost:8080/battlereportphoto', {
        method: 'POST',
        body: formData,
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'ajout de la photo");
          return res.json();
        })
        .then(newPhoto => {
          this.battleReportPhotos.push(newPhoto);
          return newPhoto;
        })
        .catch(err => {
          console.error('Erreur POST photo :', err);
          throw err;
        });
    },

    deleteBattleReportPhoto(id: number) {
      return fetch(`http://localhost:8080/battlereportphoto/${id}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors de la suppression');
          this.battleReportPhotos = this.battleReportPhotos.filter(p => p.id !== id);
        })
        .catch(err => {
          console.error('Erreur suppression photo :', err);
          throw err;
        });
    }
  }
});
