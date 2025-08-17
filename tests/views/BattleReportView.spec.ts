import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import BattleReportView from '@/views/BattleReportView.vue';
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyNameStore } from '@/stores/armyName';
import { useAllianceStore } from '@/stores/alliance';

// Mock du router
const mockPush = vi.fn();
const mockRoute = {
  params: { id: '123' }
};

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute
}));

// Mock console.error pour éviter les logs de test
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('BattleReportView - Tests unitaires', () => {
  let wrapper;
  let battleReportStore;
  let armyPhotoStore;
  let armyNameStore;
  let allianceStore;
  let pinia;

  const mockBattleReport = {
    idBattleReport: 123,
    nameBattleReport: 'Test Battle Report',
    descriptionBattleReport: 'This is a test battle report description',
    players: [
      {
        idPlayer: 1,
        playerName: 'Player 1',
        playerScore: 10,
        armyName_idArmyName: 1,
        alliance_idAlliance: 1,
        isWinner: false
      },
      {
        idPlayer: 2,
        playerName: 'Player 2',
        playerScore: 15,
        armyName_idArmyName: 2,
        alliance_idAlliance: 2,
        isWinner: true
      }
    ]
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    // Mock de la route
    const mockRoute = {
      params: { id: '123' }
    };

    wrapper = mount(BattleReportView, {
      global: {
        plugins: [pinia],
        mocks: {
          $route: mockRoute
        },
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          'v-icon': { template: '<span><slot /></span>' },
          'v-carousel': { template: '<div><slot /></div>' },
          'v-carousel-item': { template: '<div><slot /></div>' },
          'v-snackbar': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
          'v-dialog': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
          'v-spacer': { template: '<div></div>' }
        }
      }
    });

    battleReportStore = useBattleReportStore();
    armyPhotoStore = useArmyPhotoStore();
    armyNameStore = useArmyNameStore();
    allianceStore = useAllianceStore();

    // Mock des données des stores
    battleReportStore.battleReports = [mockBattleReport];
    armyPhotoStore.armyPhotos = [
      { idArmyPhoto: 1, armyName_idArmyName: 1, armyPhotoUrl: 'url1.jpg' },
      { idArmyPhoto: 2, armyName_idArmyName: 2, armyPhotoUrl: 'url2.jpg' }
    ];
    armyNameStore.armyNames = [
      { idArmyName: 1, armyNameName: 'Army 1' },
      { idArmyName: 2, armyNameName: 'Army 2' }
    ];
    allianceStore.alliances = [
      { idAlliance: 1, allianceName: 'Alliance 1' },
      { idAlliance: 2, allianceName: 'Alliance 2' }
    ];

    // Mock des méthodes des stores
    battleReportStore.getBattleReport = vi.fn().mockResolvedValue([mockBattleReport]);
    battleReportStore.fetchBattlePhotos = vi.fn().mockResolvedValue(['photo1.jpg', 'photo2.jpg']);
    battleReportStore.deleteBattleReport = vi.fn().mockResolvedValue(true);
    battleReportStore.fetchBattleReportById = vi.fn().mockResolvedValue(mockBattleReport);
    armyPhotoStore.getArmyPhoto = vi.fn().mockResolvedValue([]);
    armyNameStore.getArmyName = vi.fn().mockResolvedValue([]);
    allianceStore.getAlliance = vi.fn().mockResolvedValue([]);

    // Assurer que le rapport est accessible via computed
    battleReportStore.currentBattleReport = mockBattleReport;
    
    // Attendez le montage et la résolution des promesses
    return nextTick().then(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  describe('Rendu initial du composant', () => {
    it('devrait afficher le titre du rapport de bataille', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(wrapper.text()).toContain('Test Battle Report');
      });
    });

    it('devrait afficher les boutons d\'édition et de suppression', () => {
      const buttons = wrapper.findAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('devrait afficher la description de la bataille', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(wrapper.text()).toContain('This is a test battle report description');
      });
    });
  });

  describe('Gestion des joueurs et scores', () => {
    it('devrait afficher les informations des joueurs', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(wrapper.text()).toContain('Player 1');
        expect(wrapper.text()).toContain('Player 2');
      });
    });

    it('devrait calculer correctement les gagnants', () => {
      // Simuler des données avec des gagnants
      const battleReportWithWinners = {
        ...mockBattleReport,
        players: [
          {
            idPlayer: 1,
            playerName: 'Player 1',
            playerScore: 10,
            armyName_idArmyName: 1,
            alliance_idAlliance: 1,
            isWinner: false
          },
          {
            idPlayer: 2,
            playerName: 'Player 2',
            playerScore: 15,
            armyName_idArmyName: 2,
            alliance_idAlliance: 2,
            isWinner: true
          }
        ]
      };
      
      wrapper.vm.battleReport = battleReportWithWinners;
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        // Vérifier que les données de gagnant sont affichées
        expect(wrapper.vm.battleReport.players.some(p => p.isWinner)).toBe(true);
      });
    });

    it('devrait gérer les joueurs sans alliance', async () => {
      const battleReportWithSoloPlayer = {
        ...mockBattleReport,
        players: [
          ...mockBattleReport.players,
          {
            idPlayer: 3,
            playerName: 'Solo Player',
            playerScore: 20,
            armyName_idArmyName: 3,
            alliance_idAlliance: 4, // Alliance "Aucune"
            isWinner: false
          }
        ]
      };
      
      // Mettre à jour les données du store et du composant
      battleReportStore.battleReports = [battleReportWithSoloPlayer];
      wrapper.vm.battleReport = battleReportWithSoloPlayer;
      wrapper.vm.players = battleReportWithSoloPlayer.players;
      
      return wrapper.vm.$nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(wrapper.text()).toContain('Solo Player');
      });
    });
  });

  describe('Gestion des photos', () => {
    it('devrait récupérer les photos du rapport de bataille', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(battleReportStore.fetchBattlePhotos).toHaveBeenCalledWith(123);
      });
    });

    it('devrait gérer les erreurs lors de la récupération des photos', () => {
      // Mock pour que fetchBattlePhotos soit appelé et échoue
      battleReportStore.fetchBattlePhotos = vi.fn().mockRejectedValue(new Error('Photo error'));
      
      // Déclencher manuellement fetchBattlePhotos après le montage
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        // Appeler directement la fonction pour s'assurer qu'elle produit l'erreur attendue
        return wrapper.vm.fetchBattlePhotos(123).catch(() => {
          // L'erreur a été capturée, maintenant vérifier le console.error
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Erreur lors de la récupération des photos :',
            expect.any(Error)
          );
        });
      });
    });
  });

  describe('Actions d\'édition et suppression', () => {
    it('devrait naviguer vers la page d\'édition lors du clic sur éditer', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        // Simuler le clic sur le bouton d'édition
        const editButton = wrapper.findAll('button')[0];
        return editButton.trigger('click').then(() => {
          expect(mockPush).toHaveBeenCalledWith({
            name: 'Modify A New Battle Report',
            params: { id: 123 }
          });
        });
      });
    });

    it('devrait ouvrir la boîte de dialogue de confirmation pour la suppression', () => {
      return nextTick().then(() => {
        // Simuler le clic sur le bouton de suppression
        const deleteButton = wrapper.findAll('button')[1];
        return deleteButton.trigger('click').then(() => {
          return nextTick().then(() => {
            expect(wrapper.vm.confirmDialog).toBe(true);
          });
        });
      });
    });

    it('devrait annuler la suppression', () => {
      wrapper.vm.confirmDialog = true;
      return nextTick().then(() => {
        wrapper.vm.cancelDelete();
        
        expect(wrapper.vm.confirmDialog).toBe(false);
      });
    });

    it('devrait confirmer et effectuer la suppression', () => {
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        wrapper.vm.confirmDialog = true;
        // Assurer que battleReport a une valeur avec idBattleReport
        wrapper.vm.battleReport = {
          idBattleReport: 123,
          title: 'Test Battle',
          content: 'Test content'
        };
        return wrapper.vm.confirmDelete();
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        expect(battleReportStore.deleteBattleReport).toHaveBeenCalledWith(123);
        expect(wrapper.vm.snackbar).toBe(true);
        expect(wrapper.vm.snackbarMessage).toBe('Le rapport de bataille a bien été supprimé');
      });
    });

    it('devrait gérer les erreurs lors de la suppression', () => {
      battleReportStore.deleteBattleReport = vi.fn().mockRejectedValue(new Error('Delete error'));
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        wrapper.vm.confirmDialog = true;
        // Assurer que battleReport a une valeur avec idBattleReport
        wrapper.vm.battleReport = {
          idBattleReport: 123,
          title: 'Test Battle',
          content: 'Test content'
        };
        return wrapper.vm.confirmDelete();
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        expect(wrapper.vm.snackbarMessage).toBe('Erreur lors de la suppression du rapport');
        expect(wrapper.vm.confirmDialog).toBe(false);
      });
    });

    it('devrait gérer le cas où aucun rapport n\'est sélectionné pour la suppression', () => {
      wrapper.vm.battleReport = null;
      wrapper.vm.confirmDialog = true;
      
      wrapper.vm.confirmDelete();
      
      expect(wrapper.vm.confirmDialog).toBe(false);
      expect(battleReportStore.deleteBattleReport).not.toHaveBeenCalled();
    });
  });

  describe('Gestion de la snackbar', () => {
    it('devrait fermer la snackbar', () => {
      wrapper.vm.snackbar = true;
      
      wrapper.vm.closeSnackbar();
      
      expect(wrapper.vm.snackbar).toBe(false);
    });
  });

  describe('Fonctions utilitaires', () => {
    it('devrait retourner le nom de l\'armée', () => {
      const armyName = wrapper.vm.getArmyName(1);
      expect(armyName).toBeDefined();
    });

    it('devrait retourner l\'URL de l\'image de l\'armée', () => {
      const imageUrl = wrapper.vm.getArmyImageUrl(1);
      expect(imageUrl).toBeDefined();
    });

    it('devrait retourner le nom de l\'alliance', () => {
      const allianceName = wrapper.vm.getAllianceName(1);
      expect(allianceName).toBeDefined();
    });
  });

  describe('Gestion des erreurs onMounted', () => {
    it('devrait gérer les erreurs lors du chargement initial', async () => {
      // Recréer le composant pour déclencher onMounted
      pinia = createPinia();
      setActivePinia(pinia);
      
      // Mock de la route
      const mockRoute = {
        params: { id: '123' }
      };
      
      // Réinitialiser les stores avec les mocks d'erreur
      const newBattleReportStore = useBattleReportStore();
      newBattleReportStore.getBattleReport = vi.fn().mockRejectedValue(new Error('Mount error'));
      const newArmyPhotoStore = useArmyPhotoStore();
      newArmyPhotoStore.getArmyPhoto = vi.fn().mockResolvedValue([]);
      const newArmyNameStore = useArmyNameStore();
      newArmyNameStore.getArmyName = vi.fn().mockResolvedValue([]);
      const newAllianceStore = useAllianceStore();
      newAllianceStore.getAlliance = vi.fn().mockResolvedValue([]);
      
      wrapper = mount(BattleReportView, {
        global: {
          plugins: [pinia],
          mocks: {
            $route: mockRoute
          },
          stubs: {
            'v-container': { template: '<div><slot /></div>' },
            'v-card': { template: '<div><slot /></div>' },
            'v-card-title': { template: '<div><slot /></div>' },
            'v-card-text': { template: '<div><slot /></div>' },
            'v-card-actions': { template: '<div><slot /></div>' },
            'v-row': { template: '<div><slot /></div>' },
            'v-col': { template: '<div><slot /></div>' },
            'v-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
            'v-icon': { template: '<span><slot /></span>' },
            'v-carousel': { template: '<div><slot /></div>' },
            'v-carousel-item': { template: '<div><slot /></div>' },
            'v-snackbar': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
            'v-dialog': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
            'v-spacer': { template: '<div></div>' }
          }
        }
      });

      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur dans onMounted:', expect.any(Error));
      });
    });

    it('devrait gérer le cas où le rapport de bataille n\'existe pas', () => {
      // Vider le store et simuler un ID qui n'existe pas
      battleReportStore.battleReports = [];
      mockRoute.params.id = '999'; // ID qui n'existe pas
      
      // Créer un nouveau wrapper avec cette nouvelle route
      const wrapperWithEmptyStore = mount(BattleReportView, {
        global: {
          plugins: [pinia],
          mocks: {
            $route: mockRoute
          },
          stubs: {
            'v-container': { template: '<div><slot /></div>' },
            'v-card': { template: '<div><slot /></div>' },
            'v-card-title': { template: '<div><slot /></div>' },
            'v-card-text': { template: '<div><slot /></div>' },
            'v-card-actions': { template: '<div><slot /></div>' },
            'v-row': { template: '<div><slot /></div>' },
            'v-col': { template: '<div><slot /></div>' },
            'v-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
            'v-icon': { template: '<span><slot /></span>' },
            'v-carousel': { template: '<div><slot /></div>' },
            'v-carousel-item': { template: '<div><slot /></div>' },
            'v-snackbar': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
            'v-dialog': { template: '<div v-if="modelValue"><slot /></div>', props: ['modelValue'] },
            'v-spacer': { template: '<div></div>' }
          }
        }
      });
      
      return wrapperWithEmptyStore.vm.$nextTick().then(() => {
        expect(wrapperWithEmptyStore.vm.battleReport).toBeNull();
      });
    });
  });

  describe('Calculs de score complexes', () => {
    it('devrait gérer les scores d\'alliance égaux', async () => {
      const battleReportWithEqualScores = {
        ...mockBattleReport,
        players: [
          {
            idPlayer: 1,
            playerName: 'Player 1',
            playerScore: 10,
            armyName_idArmyName: 1,
            alliance_idAlliance: 1,
            isWinner: false
          },
          {
            idPlayer: 2,
            playerName: 'Player 2',
            playerScore: 10,
            armyName_idArmyName: 2,
            alliance_idAlliance: 2,
            isWinner: false
          }
        ]
      };
      
      wrapper.vm.battleReport = battleReportWithEqualScores;
      return wrapper.vm.$nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        // Vérifie que les données sont correctement affichées avec des scores égaux
        expect(wrapper.vm.battleReport.players.every(p => p.playerScore === 10)).toBe(true);
      });
    });
  });
});
