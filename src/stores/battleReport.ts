import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBattleReportStore = defineStore('battleReport', {
    state: () => ({ battleReport: []}),
    actions: {
      getBattleReport() {
        fetch('http://localhost:8080/battlereport')
        .then(res => res.json())
        .then(data => this.battleReport = data)
        .catch(err => console.error('Erreur API: ', err));
      },
      addBattleReport(battleReport) {
        fetch('',{method:'POST',data:JSON.stringify(battleReport)})
      }
    },
})
