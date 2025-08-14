import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';

import BattleReportCards from '../../src/components/BattleReportCards.vue';

// Mock data pour les tests
const mockPlayers = [
  {
    name: 'Joueur 1',
    allianceId: 1,
    alliance: 'Alliance Order',
    army: 'Empire',
    armyImage: '/img/armees/empire.png',
    score: 15
  },
  {
    name: 'Joueur 2',
    allianceId: 2,
    alliance: 'Alliance Chaos',
    army: 'Warriors of Chaos',
    armyImage: '/img/armees/chaos.png',
    score: 12
  },
  {
    name: 'Joueur 3',
    allianceId: 1,
    alliance: 'Alliance Order',
    army: 'High Elves',
    armyImage: '/img/armees/high-elves.png',
    score: 8
  }
];

const mockBattleReports = [
  {
    id: 1,
    title: 'Bataille de Middenheim',
    description: 'Une bataille épique entre l\'Empire et le Chaos',
    scenario: 'Conquest',
    points: 2000,
    faction: 'Empire',
    opponent: 'Warriors of Chaos',
    players: [mockPlayers[0], mockPlayers[1]],
    groupedAlliances: [[mockPlayers[0]], [mockPlayers[1]]]
  },
  {
    id: 2,
    title: 'Défense d\'Altdorf',
    description: 'La dernière résistance de l\'Empire',
    scenario: 'Siege',
    points: 1500,
    faction: 'Empire',
    opponent: 'Beastmen',
    players: [mockPlayers[0], mockPlayers[2]],
    groupedAlliances: [[mockPlayers[0], mockPlayers[2]]]
  },
  {
    id: 3,
    title: 'Guerre des Trois Royaumes',
    description: 'Conflit majeur impliquant plusieurs factions',
    scenario: 'Battleline',
    points: 3000,
    faction: 'Mixed',
    opponent: 'Mixed',
    players: mockPlayers,
    groupedAlliances: [[mockPlayers[0], mockPlayers[2]], [mockPlayers[1]]]
  }
];

const vuetifyStubs = {
  'router-link': {
    template: '<a><slot /></a>',
    props: ['to']
  },
  'v-row': { template: '<div class="v-row"><slot /></div>' },
  'v-col': { template: '<div class="v-col"><slot /></div>' },
  'v-card': { template: '<div class="v-card battle-card"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title"><slot /></div>' },
  'v-card-subtitle': { template: '<div class="v-card-subtitle"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },
  'v-btn': { 
    template: '<button class="v-btn button" @click="handleClick"><slot /></button>',
    methods: {
      handleClick(event) {
        this.$emit('click');
      }
    }
  },
  'v-icon': { template: '<span class="v-icon"><slot /></span>' },
  'v-window': { template: '<div class="v-window"><slot /></div>' },
  'v-window-item': { template: '<div class="v-window-item"><slot /></div>' }
};

describe('BattleReportCards.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Rendu en mode Grid (par défaut)', () => {
    beforeEach(() => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: mockBattleReports,
          displayMode: 'grid'
        },
        global: {
          stubs: vuetifyStubs
        }
      });
    });

    it('devrait rendre le bon nombre de cartes', () => {
      const cards = wrapper.findAll('.battle-card');
      expect(cards).toHaveLength(mockBattleReports.length);
    });

    it('devrait afficher les titres des battles', () => {
      const titles = wrapper.findAll('.v-card-title');
      expect(titles[0].text()).toBe('Bataille de Middenheim');
      expect(titles[1].text()).toBe('Défense d\'Altdorf');
      expect(titles[2].text()).toBe('Guerre des Trois Royaumes');
    });

    it('devrait afficher les points de chaque bataille', () => {
      const pointsElements = wrapper.findAll('.v-card-text');
      expect(pointsElements[0].text()).toBe('2000 points');
      expect(pointsElements[1].text()).toBe('1500 points');
      expect(pointsElements[2].text()).toBe('3000 points');
    });

    it('devrait afficher les noms des joueurs dans les sous-titres', () => {
      const subtitles = wrapper.findAll('.v-card-subtitle');
      expect(subtitles[0].text()).toContain('Joueur 1');
      expect(subtitles[0].text()).toContain('Joueur 2');
      expect(subtitles[1].text()).toContain('Joueur 1');
      expect(subtitles[1].text()).toContain('Joueur 3');
    });

    it('devrait créer les liens router-link corrects', () => {
      const routerLinks = wrapper.findAll('a');
      expect(routerLinks).toHaveLength(mockBattleReports.length);
    });
  });

  describe('Rendu en mode Carousel', () => {
    beforeEach(() => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: mockBattleReports,
          displayMode: 'carousel',
          itemsPerPage: 2
        },
        global: {
          stubs: vuetifyStubs
        }
      });
    });

    it('devrait rendre le carousel wrapper', () => {
      const carouselWrapper = wrapper.find('.carousel-wrapper');
      expect(carouselWrapper.exists()).toBe(true);
    });

    it('devrait rendre le v-window pour le carousel', () => {
      const vWindow = wrapper.find('.v-window');
      expect(vWindow.exists()).toBe(true);
    });

    it('devrait calculer le bon nombre de chunks', () => {
      const component = wrapper.vm;
      expect(component.chunkedReports).toHaveLength(2);
      expect(component.chunkedReports[0]).toHaveLength(2);
      expect(component.chunkedReports[1]).toHaveLength(1);
    });
  });

  describe('Actions et événements', () => {
    beforeEach(() => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: mockBattleReports,
          showActions: true
        },
        global: {
          stubs: vuetifyStubs
        }
      });
    });

    it('devrait afficher les boutons d\'action quand showActions est true', () => {
      const actionButtons = wrapper.findAll('.action-buttons');
      expect(actionButtons).toHaveLength(mockBattleReports.length);
    });

    it('ne devrait pas afficher les boutons d\'action quand showActions est false', () => {
      return wrapper.setProps({ showActions: false }).then(() => {
        const actionButtons = wrapper.findAll('.action-buttons');
        expect(actionButtons).toHaveLength(0);
      });
    });
  });

  describe('Props par défaut', () => {
    beforeEach(() => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: mockBattleReports
        },
        global: {
          stubs: vuetifyStubs
        }
      });
    });

    it('devrait utiliser le mode grid par défaut', () => {
      const gridContainer = wrapper.find('.v-row');
      expect(gridContainer.exists()).toBe(true);
      
      const carouselContainer = wrapper.find('.carousel-wrapper');
      expect(carouselContainer.exists()).toBe(false);
    });

    it('devrait afficher les actions par défaut', () => {
      const actionButtons = wrapper.findAll('.action-buttons');
      expect(actionButtons).toHaveLength(mockBattleReports.length);
    });

    it('devrait utiliser itemsPerPage = 3 par défaut', () => {
      const component = wrapper.vm;
      expect(component.$props.itemsPerPage).toBe(3);
    });
  });

  describe('Gestion des cas limites', () => {
    it('devrait gérer une liste vide de rapports', () => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: []
        },
        global: {
          stubs: vuetifyStubs
        }
      });

      const cards = wrapper.findAll('.battle-card');
      expect(cards).toHaveLength(0);
    });

    it('devrait gérer un rapport avec plus de 4 joueurs', () => {
      const largeBattleReport = {
        ...mockBattleReports[0],
        players: [
          ...mockPlayers,
          { ...mockPlayers[0], name: 'Joueur 4' },
          { ...mockPlayers[1], name: 'Joueur 5' }
        ]
      };

      wrapper = mount(BattleReportCards, {
        props: {
          reports: [largeBattleReport]
        },
        global: {
          stubs: vuetifyStubs
        }
      });

      const fullImage = wrapper.find('.battle-image.full');
      expect(fullImage.exists()).toBe(true);
    });

    it('devrait gérer les images d\'armée manquantes', () => {
      const reportWithoutImages = {
        ...mockBattleReports[0],
        players: [{
          ...mockPlayers[0],
          armyImage: ''
        }],
        groupedAlliances: [[{
          ...mockPlayers[0],
          armyImage: ''
        }]]
      };

      wrapper = mount(BattleReportCards, {
        props: {
          reports: [reportWithoutImages]
        },
        global: {
          stubs: vuetifyStubs
        }
      });

      const playerImage = wrapper.find('.player-image');
      expect(playerImage.exists()).toBe(true);
    });
  });

  describe('Computed properties', () => {
    beforeEach(() => {
      wrapper = mount(BattleReportCards, {
        props: {
          reports: mockBattleReports,
          displayMode: 'carousel',
          itemsPerPage: 2
        },
        global: {
          stubs: vuetifyStubs
        }
      });
    });

    it('devrait calculer chunkedReports correctement en mode carousel', () => {
      const component = wrapper.vm;
      expect(component.chunkedReports).toHaveLength(2);
      expect(component.chunkedReports[0]).toHaveLength(2);
      expect(component.chunkedReports[1]).toHaveLength(1);
    });

    it('devrait retourner un tableau vide en mode grid', () => {
      return wrapper.setProps({ displayMode: 'grid' }).then(() => {
        const component = wrapper.vm;
        expect(component.chunkedReports).toEqual([]);
      });
    });
  });
});
