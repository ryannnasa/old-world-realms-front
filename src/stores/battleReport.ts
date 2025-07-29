import { defineStore } from 'pinia';

type Player = {
  idPlayer?: number;
  name: string;
  faction: string;
  armyName?: string;
  points?: number;
  battleReport_idBattleReport?: number;
};

type BattleReportPhoto = {
  id?: number;
  battleReport_idBattleReport: number;
  name: string;
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
          this.battleReports = data;
        })
        .catch(err => console.error('Erreur API (getBattleReport) :', err));
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
          console.error('Erreur API (fetchBattleReportById) :', err);
          throw err;
        });
    },

    fetchBattleReportByUserId(idUser: string) {
      return fetch(`http://localhost:8080/battlereport/user/${idUser}`)
        .then(res => {
          if (!res.ok) throw new Error('Battle report introuvable');
          return res.json();
        })
        .then(data => {
          this.battleReports = data;
        })
        .catch(err => {
          console.error('Erreur API (fetchBattleReportByUserId) :', err);
          throw err;
        });
    },

    deleteBattleReport(id: number) {
      // Suppression du rapport (les photos seront supprimées automatiquement côté serveur)
      return fetch(`http://localhost:8080/battlereport/${id}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) throw new Error('Erreur lors de la suppression du rapport');
          this.battleReports = this.battleReports.filter(r => r.idBattleReport !== id);
          localStorage.setItem('battleReportSuccess', 'deleted');
          this.battleReportSuccess = true;
        })
        .catch(err => {
          console.error('Erreur API (deleteBattleReport) :', err);
          throw err;
        });
    },

    uploadPhotos(battleReportId: number, files: File[]) {
      if (!files || files.length === 0) {
        return Promise.resolve([]);
      }

      const formData = files.reduce((fd, file) => {
        fd.append('fileBattleReportPhoto', file);
        return fd;
      }, new FormData());

      return fetch(`http://localhost:8080/battlereport/${battleReportId}/photos`, {
        method: 'POST',
        body: formData,
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de l'upload des photos");
          return res.json();
        })
        .then((fileNames: string[]) => {
          // Mise à jour du rapport local si c'est le bon
          if (this.battleReport?.idBattleReport === battleReportId) {
            const newPhotos = fileNames.map(name => ({
              name,
              battleReport_idBattleReport: battleReportId,
            }));
            
            this.battleReport.battleReportPhotos = [
              ...(this.battleReport.battleReportPhotos || []),
              ...newPhotos
            ];
          }
          
          return fileNames;
        })
        .catch(err => {
          console.error('Erreur API (uploadPhotos) :', err);
          throw err;
        });
    },

    createBattleReport(battleReport: Omit<BattleReport, 'idBattleReport'>) {
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
          this.battleReports = [...this.battleReports, data];
          localStorage.setItem('battleReportSuccess', 'created');
          this.battleReportSuccess = true;
          return data;
        })
        .catch(err => {
          console.error('Erreur API (createBattleReport) :', err);
          throw err;
        });
    },

    updateBattleReport(battleReport: BattleReport) {
      if (!battleReport.idBattleReport) throw new Error('ID manquant pour mise à jour');

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
          this.battleReports = this.battleReports.map(r => 
            r.idBattleReport === data.idBattleReport ? data : r
          );
          
          if (this.battleReport?.idBattleReport === data.idBattleReport) {
            this.battleReport = data;
          }
          
          localStorage.setItem('battleReportSuccess', 'updated');
          this.battleReportSuccess = true;
          return data;
        })
        .catch(err => {
          console.error('Erreur API (updateBattleReport) :', err);
          throw err;
        });
    },

    deletePhotos(battleReportId: number, fileNames: string[]) {
      return fetch(`http://localhost:8080/battlereport/${battleReportId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileNames),
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la suppression des photos");
          
          // Mise à jour du state local
          if (this.battleReport?.idBattleReport === battleReportId) {
            this.battleReport.battleReportPhotos = 
              this.battleReport.battleReportPhotos?.filter(
                photo => !fileNames.includes(photo.name)
              ) || [];
          }
          
          return res.text();
        })
        .catch(err => {
          console.error('Erreur API (deletePhotos) :', err);
          throw err;
        });
    },

    checkBattleReportSuccess() {
      const action = localStorage.getItem('battleReportSuccess');
      this.battleReportSuccess = !!action;
      this.battleReportAction = action;
    },

    clearBattleReportSuccess() {
      localStorage.removeItem('battleReportSuccess');
      this.battleReportSuccess = false;
      this.battleReportAction = null;
    },

    async getPhotoUrl(filename: string): Promise<string> {
      try {
        const response = await fetch(`http://localhost:8080/image-url/${filename}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération du lien signé');
        return await response.text();
      } catch (err) {
        console.error('Erreur pour getPhotoUrl:', err);
        return '/img/erreur.jpg'; // image fallback si erreur
      }
    },

    async fetchBattlePhotos(idBattleReport: number): Promise<string[]> {
      try {
        const response = await fetch(`http://localhost:8080/battlereport/${idBattleReport}/photos`);
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        const data = await response.json();
        const urls = await Promise.all(data.map((photo: any) => this.getPhotoUrl(photo.nameBattleReportPhoto)));
        return urls;
      } catch (error) {
        console.error('Erreur lors de la récupération des photos :', error);
        return [];
      }
    },
  },
});

// Fonctions utilitaires pour éviter la duplication dans les composants
export const battleReportUtils = {
  getArmyName(armyNameStore: any, armyId: number): string {
    const army = armyNameStore.armyName.find((a: any) => a.idArmyName === armyId);
    return army ? army.nameArmyName : 'Inconnu';
  },

  getArmyImageUrl(armyPhotoStore: any, armyId: number): string {
    const photo = armyPhotoStore.armyPhoto.find((p: any) => p.armyName_idArmyName === armyId);
    return photo ? `/img/armees/${photo.photoArmyName}` : '/img/armees/default.jpg';
  },

  getAllianceName(allianceStore: any, allianceId: number): string {
    const alliance = allianceStore.alliance.find((a: any) => a.idAlliance === allianceId);
    return alliance ? alliance.allianceName : 'Aucune';
  },

  getScenarioName(scenarioStore: any, scenarioId: number): string {
    const scenario = scenarioStore.scenario.find((s: any) => s.idScenario === scenarioId);
    return scenario ? scenario.scenarioName : 'Inconnu';
  },

  groupedByAlliance(players: any[], NoAlliance: number = 4): any[][] {
    if (!Array.isArray(players)) return [];

    const groups: any[][] = [];
    const processedPlayers = new Set();

    for (const player of players) {
      if (processedPlayers.has(player.name)) continue;

      // Si le joueur n'a pas d'alliance ou est dans NoAlliance, il forme son propre groupe
      if (!player.allianceId || player.allianceId === NoAlliance) {
        groups.push([player]);
        processedPlayers.add(player.name);
      } else {
        // Trouver tous les joueurs de la même alliance
        const allianceGroup = players.filter((p: any) => 
          p.allianceId === player.allianceId && !processedPlayers.has(p.name)
        );
        
        if (allianceGroup.length > 0) {
          groups.push(allianceGroup);
          allianceGroup.forEach((p: any) => processedPlayers.add(p.name));
        }
      }
    }

    return groups;
  },
};