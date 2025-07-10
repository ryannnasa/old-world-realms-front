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
    battleReport: null as BattleReport | null, // 👈 pour un rapport individuel
    battleReportSuccess: false,
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

    addBattleReport(battleReport: BattleReport) {
      return fetch('http://localhost:8080/battlereport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(battleReport),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la création du rapport');
          }
          return response.json();
        })
        .then((data: BattleReport) => {
          this.battleReports.push(data);
          localStorage.setItem('battleReportSuccess', 'true');
          this.battleReportSuccess = true;
          return data;
        })
        .catch(error => {
          console.error('Erreur API lors de la création du BattleReport :', error);
          throw error;
        });
    },

    checkBattleReportSuccess() {
      const success = localStorage.getItem('battleReportSuccess');
      if (success) {
        this.battleReportSuccess = true;
        localStorage.removeItem('battleReportSuccess');
      }
    },

    clearBattleReportSuccess() {
      this.battleReportSuccess = false;
    }
  },
});
