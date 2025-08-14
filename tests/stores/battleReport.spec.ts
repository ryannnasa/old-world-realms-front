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
          descriptionBattleReport: 'Une autre bataille',
          armyPoints: 1500
        }
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      } as Response);

      return store.getBattleReport().then(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/battlereport');
        expect(store.battleReports).toEqual(mockData);
        expect(store.battleReports).toHaveLength(2);
      });
    });

    it('devrait gérer les erreurs de l\'API', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Erreur réseau'));

      return store.getBattleReport().then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur API (getBattleReport) :',
          expect.any(Error)
        );
        expect(store.battleReports).toEqual([]);
        
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('fetchBattleReportById', () => {
    it('devrait récupérer un battle report par ID', () => {
      const mockReport = {
        idBattleReport: 1,
        nameBattleReport: 'Test Battle',
        descriptionBattleReport: 'Description test',
        armyPoints: 1000,
        players: []
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReport),
      } as Response);

      return store.fetchBattleReportById(1).then((result) => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/battlereport/1');
        expect(store.battleReport).toEqual(mockReport);
        expect(result).toEqual(mockReport);
      });
    });

    it('devrait lever une erreur si le rapport n\'existe pas', () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      return expect(store.fetchBattleReportById(999)).rejects.toThrow('Battle report introuvable');
    });
  });

  describe('deleteBattleReport', () => {
    it('devrait supprimer un battle report et mettre à jour le state', () => {
      store.battleReports = [
        { idBattleReport: 1, nameBattleReport: 'Battle 1' },
        { idBattleReport: 2, nameBattleReport: 'Battle 2' }
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      return store.deleteBattleReport(1).then(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/battlereport/1',
          { method: 'DELETE' }
        );
        expect(store.battleReports).toHaveLength(1);
        expect(store.battleReports[0].idBattleReport).toBe(2);
        expect(store.battleReportSuccess).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('battleReportSuccess', 'deleted');
      });
    });

    it('devrait gérer les erreurs de suppression', () => {
      store.battleReports = [
        { idBattleReport: 1, nameBattleReport: 'Battle 1' }
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      return expect(store.deleteBattleReport(1)).rejects.toThrow(
        'Erreur lors de la suppression du rapport'
      ).then(() => {
        expect(store.battleReports).toHaveLength(1);
      });
    });
  });

  describe('uploadPhotos', () => {
    it('devrait retourner un tableau vide si aucun fichier', () => {
      return store.uploadPhotos(1, []).then(result => {
        expect(result).toEqual([]);
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it('devrait uploader des photos avec succès', () => {
      const mockFiles = [
        new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
        new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' })
      ];
      const mockFileNames = ['photo1.jpg', 'photo2.jpg'];
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFileNames),
      } as Response);

      return store.uploadPhotos(1, mockFiles).then(result => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/battlereport/1/photos',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
          })
        );
        expect(result).toEqual(mockFileNames);
      });
    });
  });
});

describe('BattleReport Utils', () => {
  describe('getArmyName', () => {
    it('devrait retourner le nom de l\'armée quand trouvée', () => {
      const mockArmyNameStore = {
        armyName: [
          { idArmyName: 1, nameArmyName: 'Empire' },
          { idArmyName: 2, nameArmyName: 'Orcs & Goblins' }
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
