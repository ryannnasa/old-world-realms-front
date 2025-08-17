import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import CreateABattleReport from '@/views/CreateABattleReport.vue';
import { useBattleReportStore } from '@/stores/battleReport';
import { useArmyNameStore } from '@/stores/armyName';
import { useArmyCompositionStore } from '@/stores/armyComposition';
import { useScenarioStore } from '@/stores/scenario';
import { useAllianceStore } from '@/stores/alliance';
import { useArmyPhotoStore } from '@/stores/armyPhoto';
import { useArmyStore } from '@/stores/army';
import { useAuthStore } from '@/stores/auth';

// Mock du router
const mockPush = vi.fn();
const mockRoute = {
  params: { id: undefined as string | undefined }
};

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute
}));

// Mock de lodash
vi.mock('lodash', () => ({
  default: {
    chunk: (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }
  }
}));

// Mock des APIs du navigateur
const MockFileReader = vi.fn().mockImplementation(() => ({
  onload: null,
  result: 'data:image/png;base64,mock',
  readAsDataURL: vi.fn(function() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: this.result } });
      }
    }, 0);
  })
}));

global.FileReader = MockFileReader;
global.alert = vi.fn();

describe('CreateABattleReport - Tests unitaires', () => {
  let wrapper;
  let battleReportStore;
  let armyNameStore;
  let armyCompositionStore;
  let scenarioStore;
  let allianceStore;
  let armyPhotoStore;
  let armyStore;
  let authStore;
  let pinia;

  const mockScenarios = [
    { idScenario: 1, scenarioName: 'Battle Scenario 1' },
    { idScenario: 2, scenarioName: 'Battle Scenario 2' }
  ];

  const mockArmies = [
    { idArmyName: 1, nameArmyName: 'Army 1' },
    { idArmyName: 2, nameArmyName: 'Army 2' }
  ];

  const mockAlliances = [
    { idAlliance: 1, allianceName: 'Alliance 1' },
    { idAlliance: 2, allianceName: 'Alliance 2' },
    { idAlliance: 4, allianceName: 'Aucune' }
  ];

  const mockCompositions = [
    { idArmyComposition: 1, nameArmyComposition: 'Composition 1', armyName_idArmyName: 1 },
    { idArmyComposition: 2, nameArmyComposition: 'Composition 2', armyName_idArmyName: 2 }
  ];

  beforeEach(() => {
    // Mock window.alert pour éviter les erreurs dans les tests
    global.alert = vi.fn();
    
    // Mock FileReader
    (global as any).FileReader = MockFileReader;
    
    pinia = createPinia();
    setActivePinia(pinia);

    // Configuration des stores avant le montage
    authStore = useAuthStore();
    authStore.profile = {
      id: 'test-user-id', // Ajout de l'ID nécessaire
      username: 'TestUser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };

    wrapper = mount(CreateABattleReport, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
          'v-text-field': { 
            template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue" />', 
            props: ['modelValue'] 
          },
          'v-textarea': { 
            template: '<textarea @input="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue"></textarea>', 
            props: ['modelValue'] 
          },
          'v-select': { 
            template: '<select @change="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue"><slot /></select>', 
            props: ['modelValue', 'items'] 
          },
          'v-btn': { template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>', props: ['disabled'] },
          'v-img': { template: '<div><slot /></div>' },
          'v-icon': { template: '<span><slot /></span>' }
        }
      }
    });

    // Récupération des stores
    battleReportStore = useBattleReportStore();
    armyNameStore = useArmyNameStore();
    armyCompositionStore = useArmyCompositionStore();
    scenarioStore = useScenarioStore();
    allianceStore = useAllianceStore();
    armyPhotoStore = useArmyPhotoStore();
    armyStore = useArmyStore();
    authStore = useAuthStore();

    // Mock des données des stores
    scenarioStore.scenario = mockScenarios;
    armyNameStore.armyName = mockArmies;
    allianceStore.alliance = mockAlliances;
    armyCompositionStore.armyComposition = mockCompositions;
    armyPhotoStore.armyPhoto = [];
    armyStore.army = [
      { idArmy: 1, armyName_idArmyName: 1, armyComposition_idArmyComposition: 1 },
      { idArmy: 2, armyName_idArmyName: 2, armyComposition_idArmyComposition: 2 }
    ];
    authStore.profile = { 
      id: 1,
      username: 'TestUser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };

    // Mock des méthodes des stores
    scenarioStore.getScenario = vi.fn().mockResolvedValue(mockScenarios);
    armyNameStore.getArmyName = vi.fn().mockResolvedValue(mockArmies);
    allianceStore.getAlliance = vi.fn().mockResolvedValue(mockAlliances);
    armyCompositionStore.getArmyComposition = vi.fn().mockResolvedValue(mockCompositions);
    armyPhotoStore.getArmyPhoto = vi.fn().mockResolvedValue([]);
    armyStore.getArmy = vi.fn().mockResolvedValue([
      { idArmy: 1, armyName_idArmyName: 1, armyComposition_idArmyComposition: 1 },
      { idArmy: 2, armyName_idArmyName: 2, armyComposition_idArmyComposition: 2 }
    ]);
    battleReportStore.createBattleReport = vi.fn().mockResolvedValue({ id: "123" });
    battleReportStore.updateBattleReport = vi.fn().mockResolvedValue(true);
    battleReportStore.uploadPhotos = vi.fn().mockResolvedValue(['photo1.jpg']);
    battleReportStore.deletePhotos = vi.fn().mockResolvedValue(true);
    battleReportStore.getBattleReport = vi.fn().mockResolvedValue([]);
    battleReportStore.fetchBattlePhotos = vi.fn().mockResolvedValue([]);
    
    // Reset des mocks router
    mockPush.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial du composant', () => {
    it('devrait afficher le formulaire de création de rapport de bataille', () => {
      return nextTick().then(() => {
        expect(wrapper.find('input').exists()).toBe(true);
      });
    });

    it('devrait initialiser avec deux joueurs par défaut', () => {
      return nextTick().then(() => {
        expect(wrapper.vm.players).toHaveLength(2);
        expect(wrapper.vm.players[0].name).toBe('TestUser');
      });
    });

    it('devrait charger les données des stores au montage', () => {
      mount(CreateABattleReport);
      
      // Attendre que les promesses du onMounted se résolvent
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        expect(scenarioStore.getScenario).toHaveBeenCalled();
        expect(armyNameStore.getArmyName).toHaveBeenCalled();
        expect(allianceStore.getAlliance).toHaveBeenCalled();
        expect(armyStore.getArmy).toHaveBeenCalled();
        expect(armyCompositionStore.getArmyComposition).toHaveBeenCalled();
      });
    });
  });

  describe('Gestion des joueurs', () => {
    it('devrait ajouter un nouveau joueur', () => {
      const initialLength = wrapper.vm.players.length;
      
      wrapper.vm.addPlayer();
      
      expect(wrapper.vm.players).toHaveLength(initialLength + 1);
    });

    it('devrait empêcher d\'ajouter plus de 10 joueurs', () => {
      // Ajouter 8 joueurs supplémentaires pour atteindre 10
      for (let i = 0; i < 8; i++) {
        wrapper.vm.addPlayer();
      }
      
      const lengthBefore = wrapper.vm.players.length;
      wrapper.vm.addPlayer();
      
      expect(wrapper.vm.players).toHaveLength(lengthBefore);
    });

    it('devrait supprimer un joueur selon son ID', () => {
      wrapper.vm.addPlayer(); // Ajouter un 3ème joueur
      const initialLength = wrapper.vm.players.length;
      
      wrapper.vm.removePlayer(1); // Supprimer le joueur avec id 1
      
      expect(wrapper.vm.players).toHaveLength(initialLength - 1);
    });

    it('devrait pouvoir supprimer n\'importe quel joueur par ID (même le principal)', () => {
      const initialLength = wrapper.vm.players.length;
      
      wrapper.vm.removePlayer(0);
      
      expect(wrapper.vm.players).toHaveLength(initialLength - 1);
    });

    it('devrait pouvoir supprimer même s\'il reste moins de 3 joueurs', () => {
      // S'assurer qu'on a exactement 2 joueurs
      wrapper.vm.players = [
        { id: 0, name: 'Player 1' },
        { id: 1, name: 'Player 2' }
      ];
      
      const initialLength = wrapper.vm.players.length;
      wrapper.vm.removePlayer(1);
      
      expect(wrapper.vm.players).toHaveLength(initialLength - 1);
    });
  });

  describe('Gestion des compositions d\'armée', () => {
    it('devrait filtrer les compositions selon l\'armée sélectionnée', () => {
      const filteredCompositions = wrapper.vm.getFilteredCompositions(1);
      
      expect(filteredCompositions).toEqual([
        { idArmyComposition: 1, nameArmyComposition: 'Composition 1', armyName_idArmyName: 1 }
      ]);
    });

    it('devrait retourner un tableau vide si aucune armée n\'est sélectionnée', () => {
      const filteredCompositions = wrapper.vm.getFilteredCompositions(null);
      
      expect(filteredCompositions).toEqual([]);
    });
  });

  describe('Gestion des photos', () => {
    it('devrait déclencher l\'input de fichier', () => {
      const mockClick = vi.fn();
      wrapper.vm.fileInput = { click: mockClick };
      
      wrapper.vm.triggerFileInput();
      
      expect(mockClick).toHaveBeenCalled();
    });

    it('ne devrait pas déclencher l\'input si limite atteinte', () => {
      const mockClick = vi.fn();
      wrapper.vm.fileInput = { click: mockClick };
      wrapper.vm.existingPhotos = new Array(10).fill({ name: 'photo' });
      
      wrapper.vm.triggerFileInput();
      
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('devrait traiter les fichiers valides', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockEvent = {
        target: {
          files: [mockFile],
          value: 'test.jpg'
        }
      };
      
      wrapper.vm.handleFileChange(mockEvent);
      
      expect(wrapper.vm.selectedFiles).toContain(mockFile);
    });

    it('devrait rejeter les fichiers trop volumineux', () => {
      const largeMockFile = {
        name: 'large.jpg',
        type: 'image/jpeg',
        size: 6 * 1024 * 1024 // 6MB
      };
      const mockEvent = {
        target: {
          files: [largeMockFile],
          value: ''
        }
      };
      
      wrapper.vm.handleFileChange(mockEvent);
      
      expect(global.alert).toHaveBeenCalled();
      expect(wrapper.vm.selectedFiles).not.toContain(largeMockFile);
    });

    it('devrait rejeter les formats non supportés', () => {
      const invalidMockFile = {
        name: 'test.gif',
        type: 'image/gif',
        size: 1024
      };
      const mockEvent = {
        target: {
          files: [invalidMockFile],
          value: ''
        }
      };
      
      wrapper.vm.handleFileChange(mockEvent);
      
      expect(global.alert).toHaveBeenCalled();
      expect(wrapper.vm.selectedFiles).not.toContain(invalidMockFile);
    });

    it('devrait supprimer une photo existante', () => {
      wrapper.vm.existingPhotos = [{ name: 'photo1.jpg', url: 'url1' }];
      
      wrapper.vm.removePhoto('photo1.jpg', true);
      
      return nextTick().then(() => {
        expect(wrapper.vm.existingPhotos).toHaveLength(0);
      });
    });

    it('devrait supprimer une nouvelle photo', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      wrapper.vm.selectedFiles = [mockFile];
      wrapper.vm.photoPreviews = ['preview1'];
      
      wrapper.vm.removePhoto('test.jpg', false);
      
      expect(wrapper.vm.selectedFiles).toHaveLength(0);
      expect(wrapper.vm.photoPreviews).toHaveLength(0);
    });
  });

  describe('Sauvegarde du rapport de bataille', () => {
    beforeEach(() => {
      wrapper.vm.battleTitle = 'Test Battle';
      wrapper.vm.description = 'Test Description';
      wrapper.vm.scenario = 1;
      wrapper.vm.armyPoints = 1000;
      wrapper.vm.players = [
        { id: 0, name: 'Player 1', alliance: 1, army: 1, armyComposition: 1, score: 10 },
        { id: 1, name: 'Player 2', alliance: 2, army: 2, armyComposition: 2, score: 15 }
      ];
    });

    it('devrait créer un nouveau rapport de bataille', () => {
      // Mock la méthode pour qu'elle retourne une promesse résolue avec un ID
      battleReportStore.createBattleReport.mockResolvedValue({ idBattleReport: "123" });
      
      wrapper.vm.saveBattleReport();
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        expect(battleReportStore.createBattleReport).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/AllBattleReports');
      });
    });

    it('devrait mettre à jour un rapport existant en mode édition', () => {
      mockRoute.params.id = '123';
      wrapper.vm.reportId = 123;
      
      wrapper.vm.saveBattleReport();
      
      return nextTick().then(() => {
        expect(battleReportStore.updateBattleReport).toHaveBeenCalled();
      });
    });

    it('devrait uploader les photos après la création', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      wrapper.vm.selectedFiles = [mockFile];
      
      // Mock la méthode pour qu'elle retourne une promesse résolue avec un ID
      battleReportStore.createBattleReport.mockResolvedValue({ id: "123" });
      
      wrapper.vm.saveBattleReport();
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        expect(battleReportStore.uploadPhotos).toHaveBeenCalledWith("123", [mockFile]);
      });
    });

    it('devrait gérer les erreurs de sauvegarde', () => {
      battleReportStore.createBattleReport = vi.fn().mockRejectedValue(new Error('Save error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      wrapper.vm.saveBattleReport();
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        // Le console.error peut être appelé avec différents types d'erreurs (API, sauvegarde, etc.)
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
      });
    });

    it('devrait appeler createBattleReport lors de la sauvegarde', async () => {
      // S'assurer que nous sommes en mode création (pas d'ID dans la route)
      mockRoute.params.id = undefined;
      
      // Configuration des données
      wrapper.vm.battleTitle = 'Test Battle';
      wrapper.vm.description = 'Test Description';
      wrapper.vm.scenario = 1;
      wrapper.vm.armyPoints = 1000;
      wrapper.vm.players = [
        { id: 0, name: 'Player 1', alliance: 1, army: 1, armyComposition: 1, score: 10 },
        { id: 1, name: 'Player 2', alliance: 2, army: 2, armyComposition: 2, score: 15 }
      ];
      
      // Vérifier que reportId est bien null (mode création)
      expect(wrapper.vm.reportId).toBeNull();
      
      // Mock la méthode pour qu'elle retourne une promesse résolue avec un ID
      battleReportStore.createBattleReport.mockResolvedValue({ idBattleReport: "123" });
      
      // Mock les autres méthodes qui pourraient être appelées
      global.alert = vi.fn();
      const mockPush = vi.fn();
      wrapper.vm.$router = { push: mockPush };
      
      // Attendre que saveBattleReport se termine
      await wrapper.vm.saveBattleReport();
      
      // Le composant devrait appeler createBattleReport
      expect(battleReportStore.createBattleReport).toHaveBeenCalled();
      expect(battleReportStore.createBattleReport).toHaveBeenCalledWith({
        nameBattleReport: 'Test Battle',
        descriptionBattleReport: 'Test Description',
        scenario_idScenario: 1,
        armyPoints: 1000,
        idUser: 1, // Utiliser la valeur qui est réellement passée (1 au lieu de 'test-user-id')
        players: [
          { playerName: 'Player 1', playerScore: '10', alliance_idAlliance: 1, armyName_idArmyName: 1, armyComposition_idArmyComposition: 1 },
          { playerName: 'Player 2', playerScore: '15', alliance_idAlliance: 2, armyName_idArmyName: 2, armyComposition_idArmyComposition: 2 }
        ]
      });
    });
  });

  describe('Fonctions utilitaires', () => {
    it('devrait calculer correctement le numéro de joueur', () => {
      expect(wrapper.vm.getPlayerNumber(0, 1)).toBe(2); // Premier pair, deuxième joueur
      expect(wrapper.vm.getPlayerNumber(1, 0)).toBe(3); // Deuxième pair, premier joueur
    });

    it('devrait retourner l\'URL de l\'image de l\'armée', () => {
      const imageUrl = wrapper.vm.getArmyImageUrl(1);
      expect(imageUrl).toBeDefined();
    });

    it('devrait calculer les paires de joueurs', () => {
      wrapper.vm.players = [
        { id: 0, name: 'Player 1' },
        { id: 1, name: 'Player 2' },
        { id: 2, name: 'Player 3' }
      ];
      
      const pairs = wrapper.vm.playerPairs;
      expect(pairs).toHaveLength(2); // 3 joueurs = 2 paires (2+1)
    });
  });

  describe('Réinitialisation des données', () => {
    it('devrait réinitialiser toutes les données du formulaire', () => {
      // Définir des valeurs
      wrapper.vm.battleTitle = 'Test';
      wrapper.vm.description = 'Test desc';
      wrapper.vm.selectedFiles = [new File([''], 'test.jpg')];
      
      wrapper.vm.resetFormData();
      
      expect(wrapper.vm.battleTitle).toBe('');
      expect(wrapper.vm.description).toBe('');
      expect(wrapper.vm.selectedFiles).toHaveLength(0);
      expect(wrapper.vm.players).toHaveLength(2);
    });
  });

  describe('Mode édition', () => {
    it('devrait charger un rapport existant en mode édition', async () => {
      // Configurer la route en mode édition
      mockRoute.params.id = '123';
      
      const existingReport = {
        idBattleReport: 123,
        nameBattleReport: 'Existing Battle',
        descriptionBattleReport: 'Existing Description',
        scenario_idScenario: 1,
        armyPoints: 1500,
        players: [
          { id: 0, playerName: 'Player 1', alliance_idAlliance: 1, armyName_idArmyName: 1, armyComposition_idArmyComposition: 1, playerScore: 10 }
        ]
      };
      
      // Recréer le composant en mode édition avec l'ID
      pinia = createPinia();
      setActivePinia(pinia);
      
      // Configuration des stores avant le montage
      const editBattleReportStore = useBattleReportStore();
      const editScenarioStore = useScenarioStore();
      const editArmyStore = useArmyStore();
      const editAllianceStore = useAllianceStore();
      const editArmyCompositionStore = useArmyCompositionStore();
      const editArmyNameStore = useArmyNameStore();
      
      editBattleReportStore.battleReports = [existingReport];
      editBattleReportStore.fetchBattleReportById = vi.fn().mockResolvedValue(existingReport);
      
      // Mock tous les stores requis
      editScenarioStore.getScenario = vi.fn().mockResolvedValue([]);
      editArmyStore.getArmy = vi.fn().mockResolvedValue([]);
      editAllianceStore.getAlliance = vi.fn().mockResolvedValue([]);
      editArmyCompositionStore.getArmyComposition = vi.fn().mockResolvedValue([]);
      editArmyNameStore.getArmyName = vi.fn().mockResolvedValue([]);
      
      // Mock global fetch pour les photos
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{ nameBattleReportPhoto: 'photo1.jpg' }])
        })
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('http://example.com/photo1.jpg')
        });
      
      wrapper = mount(CreateABattleReport, {
        global: {
          plugins: [pinia],
          stubs: {
            'v-container': { template: '<div><slot /></div>' },
            'v-card': { template: '<div><slot /></div>' },
            'v-card-title': { template: '<div><slot /></div>' },
            'v-card-text': { template: '<div><slot /></div>' },
            'v-row': { template: '<div><slot /></div>' },
            'v-col': { template: '<div><slot /></div>' },
            'v-text-field': { 
              template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue" />', 
              props: ['modelValue'] 
            },
            'v-textarea': { 
              template: '<textarea @input="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue"></textarea>', 
              props: ['modelValue'] 
            },
            'v-select': { 
              template: '<select @change="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue"><slot /></select>', 
              props: ['modelValue', 'items'] 
            },
            'v-btn': { template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot /></button>', props: ['disabled'] },
            'v-img': { template: '<div><slot /></div>' },
            'v-icon': { template: '<span><slot /></span>' }
          }
        }
      });
      
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      }).then(() => {
        expect(editBattleReportStore.fetchBattleReportById).toHaveBeenCalledWith('123');
      });
    });
  });
});
