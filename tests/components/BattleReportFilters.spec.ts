import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';

import BattleReportFilters from '../../src/components/BattleReportFilters.vue';

const mockFactions = ['Empire', 'Orcs & Gobelins', 'Hauts Elfes'];
const mockOpponents = ['Chaos', 'Skavens', 'Nains'];
const mockScenarios = ['Bataille rangée', 'Escarmouche', 'Siège'];

describe('BattleReportFilters - Tests unitaires', () => {
  let wrapper: VueWrapper<any>;
  const defaultProps = {
    factions: mockFactions,
    opponents: mockOpponents,
    scenarios: mockScenarios,
    selectedFaction: '',
    selectedOpponent: '',
    selectedScenario: '',
    selectedPoints: null
  };

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();

    wrapper = mount(BattleReportFilters, {
      props: defaultProps,
      global: {
        stubs: {
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-row': true,
          'v-col': true,
          'v-select': true,
          'v-text-field': true,
          'v-chip': true,
          'v-btn': true,
          'v-spacer': true,
          'v-icon': true
        }
      }
    });
  });

  describe('Initialisation du composant', () => {
    it('devrait initialiser le composant', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('devrait recevoir les props correctement', () => {
      expect(wrapper.props('factions')).toEqual(mockFactions);
      expect(wrapper.props('opponents')).toEqual(mockOpponents);
      expect(wrapper.props('scenarios')).toEqual(mockScenarios);
    });

    it('devrait initialiser les données locales', () => {
      const vm = wrapper.vm as any;
      expect(vm.localSelectedFaction).toBe('');
      expect(vm.localSelectedOpponent).toBe('');
      expect(vm.localSelectedScenario).toBe('');
      expect(vm.localSelectedPoints).toBe(null);
    });
  });

  describe('Méthodes de mise à jour', () => {
    it('devrait émettre update:selectedFaction', () => {
      const vm = wrapper.vm as any;
      vm.updateFaction('Empire');
      
      expect(wrapper.emitted('update:selectedFaction')).toBeTruthy();
      expect(wrapper.emitted('update:selectedFaction')?.[0]).toEqual(['Empire']);
    });

    it('devrait émettre update:selectedOpponent', () => {
      const vm = wrapper.vm as any;
      vm.updateOpponent('Chaos');
      
      expect(wrapper.emitted('update:selectedOpponent')).toBeTruthy();
      expect(wrapper.emitted('update:selectedOpponent')?.[0]).toEqual(['Chaos']);
    });

    it('devrait émettre update:selectedScenario', () => {
      const vm = wrapper.vm as any;
      vm.updateScenario('Bataille rangée');
      
      expect(wrapper.emitted('update:selectedScenario')).toBeTruthy();
      expect(wrapper.emitted('update:selectedScenario')?.[0]).toEqual(['Bataille rangée']);
    });

    it('devrait émettre update:selectedPoints avec un nombre', () => {
      const vm = wrapper.vm as any;
      vm.updatePoints(1500);
      
      expect(wrapper.emitted('update:selectedPoints')).toBeTruthy();
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([1500]);
    });

    it('devrait émettre update:selectedPoints avec null pour valeur vide', () => {
      const vm = wrapper.vm as any;
      vm.updatePoints('');
      
      expect(wrapper.emitted('update:selectedPoints')).toBeTruthy();
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([null]);
    });

    it('devrait émettre reset-filters lors du reset', () => {
      const vm = wrapper.vm as any;
      vm.resetFilters();
      
      expect(wrapper.emitted('reset-filters')).toBeTruthy();
    });
  });

  describe('Méthode setPoints', () => {
    it('devrait définir les points via setPoints', () => {
      const vm = wrapper.vm as any;
      vm.setPoints(2000);
      
      expect(vm.localSelectedPoints).toBe(2000);
      expect(wrapper.emitted('update:selectedPoints')).toBeTruthy();
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([2000]);
    });

    it('devrait gérer différentes valeurs de points', () => {
      const vm = wrapper.vm as any;
      
      vm.setPoints(500);
      expect(vm.localSelectedPoints).toBe(500);
      
      vm.setPoints(3000);
      expect(vm.localSelectedPoints).toBe(3000);
      
      vm.setPoints(0);
      expect(vm.localSelectedPoints).toBe(0);
    });
  });

  describe('Gestion responsive', () => {
    it('devrait basculer les filtres sur mobile', () => {
      const vm = wrapper.vm as any;
      vm.isMobile = true;
      vm.showFilters = false;
      
      vm.toggleFilters();
      
      expect(vm.showFilters).toBe(true);
    });

    it('ne devrait pas basculer les filtres sur desktop', () => {
      const vm = wrapper.vm as any;
      vm.isMobile = false;
      vm.showFilters = true;
      
      vm.toggleFilters();
      
      expect(vm.showFilters).toBe(true);
    });

    it('devrait gérer checkScreenSize', () => {
      const vm = wrapper.vm as any;
      vm.checkScreenSize();
      
      expect(vm.isMobile).toBe(false);
    });

    it('devrait gérer les event listeners au lifecycle', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      wrapper.unmount();
      
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Réactivité des props', () => {
    it('devrait recevoir les nouvelles props', () => {
      return wrapper.setProps({
        selectedFaction: 'Empire',
        selectedOpponent: 'Chaos',
        selectedScenario: 'Bataille rangée',
        selectedPoints: 1500
      }).then(() => {
        expect(wrapper.props('selectedFaction')).toBe('Empire');
        expect(wrapper.props('selectedOpponent')).toBe('Chaos');
        expect(wrapper.props('selectedScenario')).toBe('Bataille rangée');
        expect(wrapper.props('selectedPoints')).toBe(1500);
      });
    });

    it('devrait recevoir les changements partiels de props', () => {
      return wrapper.setProps({
        selectedFaction: 'Orcs & Gobelins'
      }).then(() => {
        expect(wrapper.props('selectedFaction')).toBe('Orcs & Gobelins');
      });
    });
  });

  describe('Conversion de types pour les points', () => {
    it('devrait convertir une chaîne en nombre', () => {
      const vm = wrapper.vm as any;
      vm.updatePoints('1000');
      
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([1000]);
    });

    it('devrait gérer null', () => {
      const vm = wrapper.vm as any;
      vm.updatePoints(null);
      
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([null]);
    });

    it('devrait convertir undefined en NaN', () => {
      const vm = wrapper.vm as any;
      vm.updatePoints(undefined);
      
      expect(wrapper.emitted('update:selectedPoints')?.[0]).toEqual([NaN]);
    });
  });
});
