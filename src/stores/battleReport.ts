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
    battleReportSuccess: false,  // <- nouveau flag
  }),
  actions: {
    getBattleReport() {
      return fetch('http://localhost:8080/battlereport')
        .then(res => res.json())
        .then(data => this.battleReports = data)
        .catch(err => console.error('Erreur API: ', err));
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
          // Dès que la création réussit, on sauvegarde le flag dans localStorage
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
      // Vérifie localStorage et met à jour l'état, puis efface la clé
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
