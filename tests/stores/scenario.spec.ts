import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useScenarioStore } from '../../src/stores/scenario';

describe('Scenario Store - Tests unitaires', () => {
  let store: ReturnType<typeof useScenarioStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useScenarioStore();
    vi.clearAllMocks();
    
    global.fetch = vi.fn();
  });

  describe('État initial du store', () => {
    it('devrait initialiser avec un tableau vide', () => {
      expect(store.scenario).toEqual([]);
    });
  });

  describe('getScenario', () => {
    it('devrait récupérer la liste des scénarios avec succès', () => {
      const mockData = [
        {
          idScenario: 1,
          nameScenario: 'Bataille rangée',
          description: 'Combat frontal classique'
        },
        {
          idScenario: 2,
          nameScenario: 'Escarmouche',
          description: 'Petit engagement'
        }
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      } as Response);

      store.getScenario();

      return new Promise(resolve => setTimeout(resolve, 50)).then(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/scenario');
        expect(store.scenario).toEqual(mockData);
      });
    });

    it('devrait gérer les erreurs de l\'API', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      store.getScenario();

      return new Promise(resolve => setTimeout(resolve, 50)).then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur API: ',
          expect.any(Error)
        );
        
        consoleErrorSpy.mockRestore();
      });
    });

    it('devrait gérer les erreurs JSON', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as Response);

      store.getScenario();

      return new Promise(resolve => setTimeout(resolve, 50)).then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur API: ',
          expect.any(Error)
        );
        
        consoleErrorSpy.mockRestore();
      });
    });

    it('devrait traiter une réponse vide', () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve([]),
      } as Response);

      store.getScenario();

      return new Promise(resolve => setTimeout(resolve, 50)).then(() => {
        expect(store.scenario).toEqual([]);
      });
    });
  });
});
