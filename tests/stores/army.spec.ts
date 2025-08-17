import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useArmyStore } from '../../src/stores/army';

describe('Army Store - Tests unitaires', () => {
  let store: ReturnType<typeof useArmyStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useArmyStore();
    vi.clearAllMocks();
    
    global.fetch = vi.fn();
  });

  describe('État initial du store', () => {
    it('devrait initialiser avec un tableau vide', () => {
      expect(store.army).toEqual([]);
    });
  });

  describe('getArmy', () => {
    it('devrait récupérer la liste des armées avec succès', () => {
      const mockData = [
        {
          idArmy: 1,
          nameArmy: 'Empire',
          description: 'Forces humaines'
        },
        {
          idArmy: 2,
          nameArmy: 'Orcs & Gobelins',
          description: 'Peaux-vertes'
        }
      ];

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      return store.getArmy().then(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/army');
        expect(store.army).toEqual(mockData);
        expect(store.army).toHaveLength(2);
        expect(consoleLogSpy).toHaveBeenCalledWith('Data loaded in Army Store:', mockData);
        
        consoleLogSpy.mockRestore();
      });
    });

    it('devrait gérer les erreurs de réponse réseau', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response);

      return store.getArmy().then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur API: ',
          expect.any(Error)
        );
        expect(store.army).toEqual([]);
        
        consoleErrorSpy.mockRestore();
      });
    });

    it('devrait gérer les erreurs de réseau', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      return store.getArmy().then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur API: ',
          expect.any(Error)
        );
        expect(store.army).toEqual([]);
        
        consoleErrorSpy.mockRestore();
      });
    });

    it('devrait gérer une réponse JSON vide', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      return store.getArmy().then(() => {
        expect(store.army).toEqual([]);
        expect(consoleLogSpy).toHaveBeenCalledWith('Data loaded in Army Store:', []);
        
        consoleLogSpy.mockRestore();
      });
    });
  });
});
