import { defineStore } from 'pinia';

type Player = {
  idPlayer?: number; // optionnel si tu en as un en base
  name: string;
  faction: string;
  armyName?: string;
  points?: number;
  battleReport_idBattleReport?: number; // pour correspondre au back
};

type BattleReportPhoto = {
  id?: number;
  battleReport_idBattleReport: number; // nom back
  name: string;
  fileBattleReportPhoto?: File; // pour les uploads
};

type BattleReport = {
  idBattleReport?: number;
  nameBattleReport?: string;
  descriptionBattleReport?: string;
  battleReportPhotos?: BattleReportPhoto[];
  scenario_idScenario?: number;
  players?: Player[];
  armyPoints?: number;
  idUser?: string;
};

export const useBattleReportStore = defineStore('battleReport', {
  state: () => ({
    battleReports: [] as BattleReport[],
    battleReport: null as BattleReport | null,
    battleReportSuccess: false,
    battleReportAction: null as string | null,
  }),

  actions: {
    getBattleReport() {
      return fetch('http://localhost:8080/battlereport')
        .then(res => res.json())
        .then(data => {
          console.log('Data reçue de getBattleReport :', data);
          console.log('Type de data :', Array.isArray(data));
          this.battleReports = data;
        })
        .catch(err => console.error('Erreur API: ', err));
    },

    fetchBattleReportById(id: number) {
      return fetch(`http://localhost:8080/battlereport/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Battle report introuvable');
          return res.json();
        })
        .then(data => {
          this.battleReport = data;
          return data;
        })
        .catch(err => {
          console.error('Erreur API (fetchBattleReportById):', err);
          throw err;
        });
    },

    fetchBattleReportByUserId(idUser: string) {
      return fetch(`http://localhost:8080/battlereport/user/${idUser}`)
        .then(res => {
          if (!res.ok) {
            console.log('Erreur API (fetchBattleReportByUserId):', res.statusText);
            throw new Error('Battle report introuvable');
          }
          return res.json();
        })
        .then(data => {
          this.battleReports = data;
        })
        .catch(err => {
          console.error('Erreur API (fetchBattleReportByUserId):', err);
          throw err;
        });
    },

    deleteBattleReport(id: number) {
      return fetch(`http://localhost:8080/battlereport/${id}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error('Erreur lors de la suppression du rapport');

          // Mise à jour locale
          this.battleReports = this.battleReports.filter(report => report.idBattleReport !== id);

          localStorage.setItem('battleReportSuccess', 'deleted');
          this.battleReportSuccess = true;
        })
        .catch(err => {
          console.error('Erreur API (deleteBattleReport):', err);
          throw err;
        });
    },

    postBattleReport(battleReport: BattleReport) {
      return fetch('http://localhost:8080/battlereport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleReport),
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'ajout du rapport");
          return res.json();
        })
        .then(data => {
          console.log('Avant push :', this.battleReports);
          this.battleReports.push(data);
          localStorage.setItem('battleReportSuccess', 'created');
          this.battleReportSuccess = true;
        })
        .catch(err => {
          console.error('Erreur API (postBattleReport):', err);
          throw err;
        });
    },

    updateBattleReport(battleReport: BattleReport) {
      if (!battleReport.idBattleReport) {
        throw new Error('L\'ID du BattleReport est nécessaire pour la mise à jour');
      }
      return fetch(`http://localhost:8080/battlereport/${battleReport.idBattleReport}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleReport),
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la mise à jour du rapport");
          return res.json();
        })
        .then(data => {
          const index = this.battleReports.findIndex(r => r.idBattleReport === data.idBattleReport);
          if (index !== -1) {
            this.battleReports[index] = data;
          }
          localStorage.setItem('battleReportSuccess', 'updated');
          this.battleReportSuccess = true;
        })
        .catch(err => {
          console.error('Erreur API (updateBattleReport):', err);
          throw err;
        });
    },

    checkBattleReportSuccess() {
      const action = localStorage.getItem('battleReportSuccess');
      if (action) {
        this.battleReportAction = action;
        this.battleReportSuccess = true;
      } else {
        this.battleReportSuccess = false;
        this.battleReportAction = null;
      }
    },

    clearBattleReportSuccess() {
      localStorage.removeItem('battleReportSuccess');
      this.battleReportSuccess = false;
      this.battleReportAction = null;
    },
  },
});
