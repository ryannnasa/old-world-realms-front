import { defineStore } from 'pinia'

type Player = {
  name: string;
  faction: string;
  armyName?: string;
  points?: number;
};

type BattleReport = {
  idBattleReport?: number;
  nameBattleReport?: string;
  descriptionBattleReport?: string;
  battleReportPhoto_idBattleReportPhoto?: number;
  scenario_idScenario?: number;
  players?: Player[];
  armyPoints: number;
};

export const useBattleReportStore = defineStore('battleReport', {
  state: () => ({
    battleReports: [] as BattleReport[],
    battleReport: null as BattleReport | null, // pour un rapport individuel
    battleReportSuccess: false,
    battleReportAction: null as string | null,
  }),

  actions: {
    getBattleReport() {
      return fetch('http://localhost:8080/battlereport')
        .then(res => res.json())
        .then(data => this.battleReports = data)
        .catch(err => console.error('Erreur API: ', err));
    },

    fetchBattleReportById(id: number) {
      return fetch(`http://localhost:8080/battlereport/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Battle report introuvable');
          }
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

    deleteBattleReport(id: number) {
      return fetch(`http://localhost:8080/battlereport/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression du rapport');
          }
          // Mise à jour locale de la liste
          this.battleReports = this.battleReports.filter(report => report.idBattleReport !== id);

          // Stocker l'action dans localStorage pour la snackbar
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
          if (!res.ok) {
            throw new Error("Erreur lors de l'ajout du rapport");
          }
          return res.json();
        })
        .then(data => {
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
      return fetch(`http://localhost:8080/battlereport/${battleReport.idBattleReport}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleReport),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Erreur lors de la mise à jour du rapport");
          }
          return res.json();
        })
        .then(data => {
          // Mettre à jour le rapport dans la liste locale
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
