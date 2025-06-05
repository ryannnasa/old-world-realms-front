import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBattleReportStore = defineStore('battleReport', {
    state: () => ({ battleReports: []}),
    actions: {
      getBattleReport() {
        fetch('http://localhost:8080/battlereport')
        .then(res => res.json())
        .then(data => this.battleReports = data)
        .catch(err => console.error('Erreur API: ', err));
      },
addBattleReport(battleReport) {
  fetch('http://localhost:8080/battlereport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(battleReport),
  })
  .then(res => {
    if (!res.ok) throw new Error('Erreur lors de la création du rapport');
    return res.text();
});
    },
  },
});
