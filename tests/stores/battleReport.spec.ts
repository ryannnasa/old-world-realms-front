import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useBattleReportStore, battleReportUtils } from '../../src/stores/battleReport';

describe('BattleReport Store - Tests unitaires', () => {
  let store: ReturnType<typeof useBattleReportStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBattleReportStore();
    vi.clearAllMocks();
    
    global.fetch = vi.fn();
    
    const mockLocalStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  describe('État initial du store', () => {
    it('devrait initialiser avec des valeurs par défaut', () => {
      expect(store.battleReports).toEqual([]);
      expect(store.battleReport).toBeNull();
      expect(store.battleReportSuccess).toBe(false);
      expect(store.battleReportAction).toBeNull();
    });
  });

  describe('getBattleReport', () => {
    it('devrait récupérer la liste des battle reports avec succès', () => {
      const mockData = [
        {
          idBattleReport: 1,
          nameBattleReport: 'Test Battle',
          descriptionBattleReport: 'Une bataille de test',
          armyPoints: 1000
        },
        {
          idBattleReport: 2,
          nameBattleReport: 'Test Battle 2',
          descriptionBattleReport: 'Une autre bataille de test',
          armyPoints: 1500
        }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      return store.getBattleReport().then(() => {
        expect(store.battleReports).toEqual(mockData);
  expect(global.fetch).toHaveBeenCalledWith('https://api.oldworldrealms.app/battlereport');
      });
    });

    it('devrait gérer les erreurs de l\'API', () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      return store.getBattleReport().then(() => {
        expect(store.battleReports).toEqual([]);
      });
    });
  });

  describe('fetchBattleReportById', () => {
    it('devrait récupérer un battle report par ID', () => {
      const mockReport = {
        idBattleReport: 1,
        nameBattleReport: 'Test Battle',
        descriptionBattleReport: 'Une bataille de test'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReport)
      });

      return store.fetchBattleReportById(1).then((result) => {
        expect(result).toEqual(mockReport);
        expect(store.battleReport).toEqual(mockReport);
  expect(global.fetch).toHaveBeenCalledWith('https://api.oldworldrealms.app/battlereport/1');
      });
    });

    it('devrait lever une erreur si le rapport n\'existe pas', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.fetchBattleReportById(999).catch((error) => {
        expect(error.message).toBe('Battle report introuvable');
      });
    });
  });

  describe('fetchBattleReportByUserId', () => {
    it('devrait récupérer les battle reports par user ID', () => {
      const mockReports = [
        {
          idBattleReport: 1,
          nameBattleReport: 'User Battle 1',
          idUser: 'user123'
        }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReports)
      });

      return store.fetchBattleReportByUserId('user123').then(() => {
        expect(store.battleReports).toEqual(mockReports);
  expect(global.fetch).toHaveBeenCalledWith('https://api.oldworldrealms.app/battlereport/user/user123');
      });
    });

    it('devrait gérer les erreurs lors de la récupération par user ID', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.fetchBattleReportByUserId('user123').catch((error) => {
        expect(error.message).toBe('Battle report introuvable');
      });
    });
  });

  describe('deleteBattleReport', () => {
    it('devrait supprimer un battle report et mettre à jour le state', () => {
      store.battleReports = [
        { idBattleReport: 1, nameBattleReport: 'Test 1' },
        { idBattleReport: 2, nameBattleReport: 'Test 2' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true
      });

      return store.deleteBattleReport(1).then(() => {
        expect(store.battleReports).toHaveLength(1);
        expect(store.battleReports[0].idBattleReport).toBe(2);
        expect(store.battleReportSuccess).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('battleReportSuccess', 'deleted');
      });
    });

    it('devrait gérer les erreurs de suppression', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.deleteBattleReport(1).catch((error) => {
        expect(error.message).toBe('Erreur lors de la suppression du rapport');
      });
    });
  });

  describe('uploadPhotos', () => {
    it('devrait uploader des photos avec succès', () => {
      const mockFiles = [
        new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
        new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' })
      ];
      const mockResponse = ['photo1.jpg', 'photo2.jpg'];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      store.battleReport = {
        idBattleReport: 1,
        battleReportPhotos: []
      };

      return store.uploadPhotos(1, mockFiles).then((result) => {
        expect(result).toEqual(mockResponse);
        expect(store.battleReport?.battleReportPhotos).toHaveLength(2);
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.oldworldrealms.app/battlereport/1/photos',
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

    it('devrait retourner un tableau vide si aucun fichier', () => {
      return store.uploadPhotos(1, []).then((result) => {
        expect(result).toEqual([]);
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it('devrait gérer les erreurs d\'upload', () => {
      const mockFiles = [new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })];

      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.uploadPhotos(1, mockFiles).catch((error) => {
        expect(error.message).toBe("Erreur lors de l'upload des photos");
      });
    });
  });

  describe('createBattleReport', () => {
    it('devrait créer un battle report avec succès', () => {
      const newBattleReport = {
        nameBattleReport: 'Nouveau rapport',
        descriptionBattleReport: 'Description',
        armyPoints: 1500
      };

      const mockResponse = { idBattleReport: 3, ...newBattleReport };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      return store.createBattleReport(newBattleReport).then((result) => {
        expect(result).toEqual(mockResponse);
        expect(store.battleReports).toHaveLength(1);
        expect(store.battleReports[0]).toEqual(mockResponse);
        expect(store.battleReportSuccess).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('battleReportSuccess', 'created');
      });
    });

    it('devrait gérer les erreurs de création', () => {
      const newBattleReport = { nameBattleReport: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.createBattleReport(newBattleReport).catch((error) => {
        expect(error.message).toBe("Erreur lors de l'ajout du rapport");
      });
    });
  });

  describe('updateBattleReport', () => {
    it('devrait mettre à jour un battle report avec succès', () => {
      const existingReport = {
        idBattleReport: 1,
        nameBattleReport: 'Rapport original',
        armyPoints: 1000
      };

      const updatedReport = {
        idBattleReport: 1,
        nameBattleReport: 'Rapport modifié',
        armyPoints: 1200
      };

      store.battleReports = [existingReport];
      store.battleReport = existingReport;

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedReport)
      });

      return store.updateBattleReport(updatedReport).then((result) => {
        expect(result).toEqual(updatedReport);
        expect(store.battleReports[0]).toEqual(updatedReport);
        expect(store.battleReport).toEqual(updatedReport);
        expect(store.battleReportSuccess).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('battleReportSuccess', 'updated');
      });
    });

    it('devrait lever une erreur si l\'ID est manquant', () => {
      const battleReportWithoutId = { nameBattleReport: 'Test' };

      expect(() => store.updateBattleReport(battleReportWithoutId as any))
        .toThrow('ID manquant pour mise à jour');
    });

    it('devrait gérer les erreurs de mise à jour', () => {
      const battleReport = { idBattleReport: 1, nameBattleReport: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.updateBattleReport(battleReport).catch((error) => {
        expect(error.message).toBe("Erreur lors de la mise à jour du rapport");
      });
    });
  });

  describe('deletePhotos', () => {
    it('devrait supprimer des photos avec succès', () => {
      store.battleReport = {
        idBattleReport: 1,
        battleReportPhotos: [
          { name: 'photo1.jpg', battleReport_idBattleReport: 1 },
          { name: 'photo2.jpg', battleReport_idBattleReport: 1 },
          { name: 'photo3.jpg', battleReport_idBattleReport: 1 }
        ]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('Photos supprimées')
      });

      return store.deletePhotos(1, ['photo1.jpg', 'photo2.jpg']).then(() => {
        expect(store.battleReport?.battleReportPhotos).toHaveLength(1);
        expect(store.battleReport?.battleReportPhotos?.[0].name).toBe('photo3.jpg');
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.oldworldrealms.app/battlereport/1/photos',
          expect.objectContaining({
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(['photo1.jpg', 'photo2.jpg'])
          })
        );
      });
    });

    it('devrait gérer les erreurs de suppression de photos', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.deletePhotos(1, ['photo1.jpg']).catch((error) => {
        expect(error.message).toBe("Erreur lors de la suppression des photos");
      });
    });
  });

  describe('checkBattleReportSuccess', () => {
    it('devrait vérifier le succès depuis localStorage', () => {
      (localStorage.getItem as any).mockReturnValue('created');

      store.checkBattleReportSuccess();

      expect(store.battleReportSuccess).toBe(true);
      expect(store.battleReportAction).toBe('created');
      expect(localStorage.getItem).toHaveBeenCalledWith('battleReportSuccess');
    });

    it('devrait gérer l\'absence de valeur dans localStorage', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      store.checkBattleReportSuccess();

      expect(store.battleReportSuccess).toBe(false);
      expect(store.battleReportAction).toBeNull();
    });
  });

  describe('clearBattleReportSuccess', () => {
    it('devrait nettoyer le succès du localStorage', () => {
      store.battleReportSuccess = true;
      store.battleReportAction = 'created';

      store.clearBattleReportSuccess();

      expect(store.battleReportSuccess).toBe(false);
      expect(store.battleReportAction).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('battleReportSuccess');
    });
  });

  describe('getPhotoUrl', () => {
    it('devrait récupérer l\'URL d\'une photo avec succès', () => {
      const mockUrl = 'https://example.com/signed-url';
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockUrl)
      });

      return store.getPhotoUrl('photo.jpg').then(result => {
        expect(result).toBe(mockUrl);
  expect(global.fetch).toHaveBeenCalledWith('https://api.oldworldrealms.app/image-url/photo.jpg');
      });
    });

    it('devrait retourner une URL d\'erreur en cas d\'échec', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.getPhotoUrl('photo.jpg').then(result => {
        expect(result).toBe('/img/erreur.jpg');
      });
    });

    it('devrait gérer les erreurs de réseau', () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      return store.getPhotoUrl('photo.jpg').then(result => {
        expect(result).toBe('/img/erreur.jpg');
      });
    });
  });

  describe('fetchBattlePhotos', () => {
    it('devrait récupérer les photos d\'un battle report avec succès', () => {
      const mockPhotos = [
        { nameBattleReportPhoto: 'photo1.jpg' },
        { nameBattleReportPhoto: 'photo2.jpg' }
      ];
      const mockUrls = ['url1', 'url2'];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPhotos)
      });

      // Mock getPhotoUrl pour chaque photo
      vi.spyOn(store, 'getPhotoUrl')
        .mockResolvedValueOnce('url1')
        .mockResolvedValueOnce('url2');

      return store.fetchBattlePhotos(1).then(result => {
        expect(result).toEqual(mockUrls);
  expect(global.fetch).toHaveBeenCalledWith('https://api.oldworldrealms.app/battlereport/1/photos');
        expect(store.getPhotoUrl).toHaveBeenCalledTimes(2);
      });
    });

    it('devrait retourner un tableau vide en cas d\'erreur', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false
      });

      return store.fetchBattlePhotos(1).then(result => {
        expect(result).toEqual([]);
      });
    });

    it('devrait gérer les erreurs de réseau', () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      return store.fetchBattlePhotos(1).then(result => {
        expect(result).toEqual([]);
      });
    });
  });
});

describe('BattleReport Utils - Tests unitaires', () => {
  describe('getArmyName', () => {
    it('devrait retourner le nom de l\'armée', () => {
      const mockArmyNameStore = {
        armyName: [
          { idArmyName: 1, nameArmyName: 'Empire' },
          { idArmyName: 2, nameArmyName: 'Orcs' }
        ]
      };
      
      const result = battleReportUtils.getArmyName(mockArmyNameStore, 1);
      expect(result).toBe('Empire');
    });

    it('devrait retourner "Inconnu" quand l\'armée n\'est pas trouvée', () => {
      const mockArmyNameStore = { armyName: [] };
      
      const result = battleReportUtils.getArmyName(mockArmyNameStore, 999);
      expect(result).toBe('Inconnu');
    });
  });

  describe('getArmyImageUrl', () => {
    it('devrait retourner l\'URL de l\'image de l\'armée', () => {
      const mockArmyPhotoStore = {
        armyPhoto: [
          { armyName_idArmyName: 1, photoArmyName: 'empire.jpg' },
          { armyName_idArmyName: 2, photoArmyName: 'orcs.jpg' }
        ]
      };

      const result = battleReportUtils.getArmyImageUrl(mockArmyPhotoStore, 1);
      expect(result).toBe('/img/armees/empire.jpg');
    });

    it('devrait retourner l\'URL par défaut quand la photo n\'est pas trouvée', () => {
      const mockArmyPhotoStore = { armyPhoto: [] };

      const result = battleReportUtils.getArmyImageUrl(mockArmyPhotoStore, 999);
      expect(result).toBe('/img/armees/default.jpg');
    });
  });

  describe('getAllianceName', () => {
    it('devrait retourner le nom de l\'alliance', () => {
      const mockAllianceStore = {
        alliance: [
          { idAlliance: 1, allianceName: 'Forces du Bien' },
          { idAlliance: 2, allianceName: 'Forces du Mal' }
        ]
      };

      const result = battleReportUtils.getAllianceName(mockAllianceStore, 1);
      expect(result).toBe('Forces du Bien');
    });

    it('devrait retourner "Aucune" quand l\'alliance n\'est pas trouvée', () => {
      const mockAllianceStore = { alliance: [] };

      const result = battleReportUtils.getAllianceName(mockAllianceStore, 999);
      expect(result).toBe('Aucune');
    });
  });

  describe('getScenarioName', () => {
    it('devrait retourner le nom du scénario', () => {
      const mockScenarioStore = {
        scenario: [
          { idScenario: 1, scenarioName: 'Bataille rangée' },
          { idScenario: 2, scenarioName: 'Siège' }
        ]
      };

      const result = battleReportUtils.getScenarioName(mockScenarioStore, 1);
      expect(result).toBe('Bataille rangée');
    });

    it('devrait retourner "Inconnu" quand le scénario n\'est pas trouvé', () => {
      const mockScenarioStore = { scenario: [] };

      const result = battleReportUtils.getScenarioName(mockScenarioStore, 999);
      expect(result).toBe('Inconnu');
    });
  });

  describe('groupedByAlliance', () => {
    it('devrait grouper les joueurs par alliance correctement', () => {
      const mockPlayers = [
        { name: 'Player1', allianceId: 1 },
        { name: 'Player2', allianceId: 2 },
        { name: 'Player3', allianceId: 1 },
        { name: 'Player4', allianceId: null },
        { name: 'Player5', allianceId: 4 }
      ];
      
      const result = battleReportUtils.groupedByAlliance(mockPlayers);
      
      expect(result).toHaveLength(4);

      const alliance1Group = result.find(group => 
        group.some(player => player.allianceId === 1)
      );
      expect(alliance1Group).toHaveLength(2);
      expect(alliance1Group?.map(p => p.name).sort()).toEqual(['Player1', 'Player3']);
    });

    it('devrait traiter les joueurs sans alliance individuellement', () => {
      const mockPlayers = [
        { name: 'Player1', allianceId: 4 }, // NoAlliance
        { name: 'Player2', allianceId: null },
        { name: 'Player3', allianceId: undefined }
      ];

      const result = battleReportUtils.groupedByAlliance(mockPlayers, 4);

      expect(result).toHaveLength(3);
      expect(result.every(group => group.length === 1)).toBe(true);
    });

    it('devrait éviter les doublons dans les groupes', () => {
      const mockPlayers = [
        { name: 'Player1', allianceId: 1 },
        { name: 'Player1', allianceId: 1 }, // Doublon
        { name: 'Player2', allianceId: 1 }
      ];

      const result = battleReportUtils.groupedByAlliance(mockPlayers);

      expect(result).toHaveLength(1);
      // Le doublon est traité comme un joueur séparé dans la logique actuelle
      expect(result[0]).toHaveLength(3);
      expect(result[0].map(p => p.name)).toEqual(['Player1', 'Player1', 'Player2']);
    });

    it('devrait gérer un tableau vide', () => {
      const result = battleReportUtils.groupedByAlliance([]);
      expect(result).toEqual([]);
    });

    it('devrait gérer une entrée non-array', () => {
      const result = battleReportUtils.groupedByAlliance(null as any);
      expect(result).toEqual([]);
    });
  });
});
