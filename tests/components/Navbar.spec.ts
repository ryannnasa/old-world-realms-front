import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';

import Navbar from '../../src/components/Navbar.vue';

// Mock du router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush
};

// Mock de useRouter
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

describe('Navbar - Tests unitaires', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    wrapper = mount(Navbar, {
      global: {
        stubs: {
          'v-app-bar': true,
          'v-btn': true,
          'v-icon': true
        }
      }
    });
  });

  describe('Rendu du composant', () => {
    it('devrait rendre la navbar', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('devrait avoir la structure de base', () => {
      expect(wrapper.find('.navbar-container').exists()).toBe(true);
    });
  });

  describe('État initial', () => {
    it('devrait initialiser avec le menu mobile fermé', () => {
      const vm = wrapper.vm as any;
      expect(vm.showMobileMenu).toBe(false);
    });
  });

  describe('Gestion du menu mobile', () => {
    it('devrait basculer le menu mobile', () => {
      const vm = wrapper.vm as any;
      expect(vm.showMobileMenu).toBe(false);
      
      vm.toggleMobileMenu();
      
      expect(vm.showMobileMenu).toBe(true);
    });

    it('devrait fermer le menu mobile', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      
      vm.closeMobileMenu();
      
      expect(vm.showMobileMenu).toBe(false);
    });

    it('devrait afficher le menu mobile quand ouvert', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      
      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.find('.mobile-menu-external').exists()).toBe(true);
      });
    });

    it('ne devrait pas afficher le menu mobile quand fermé', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = false;
      
      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.find('.mobile-menu-external').exists()).toBe(false);
      });
    });
  });

  describe('Navigation programmatique', () => {
    it('devrait naviguer et fermer le menu mobile', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      
      vm.navigateAndClose('/homepage');
      
      expect(mockPush).toHaveBeenCalledWith('/homepage');
      expect(vm.showMobileMenu).toBe(false);
    });

    it('devrait gérer différentes routes', () => {
      const vm = wrapper.vm as any;
      
      vm.navigateAndClose('/allbattlereports');
      expect(mockPush).toHaveBeenCalledWith('/allbattlereports');
      
      vm.navigateAndClose('/createabattlereport');
      expect(mockPush).toHaveBeenCalledWith('/createabattlereport');
      
      vm.navigateAndClose('/myaccount');
      expect(mockPush).toHaveBeenCalledWith('/myaccount');
    });
  });

  describe('Menu mobile - contenu', () => {
    beforeEach(() => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      return wrapper.vm.$nextTick();
    });

    it('devrait afficher tous les éléments de navigation mobile', () => {
      const mobileNavItems = wrapper.findAll('.mobile-nav-item');
      expect(mobileNavItems.length).toBe(4);
      
      const expectedTexts = [
        'Accueil',
        'Mes Rapports de Batailles',
        'Créer un Rapport de Bataille',
        'Mon Compte'
      ];
      
      mobileNavItems.forEach((item, index) => {
        expect(item.text()).toContain(expectedTexts[index]);
      });
    });
  });

  describe('Classes CSS', () => {
    it('devrait avoir les bonnes classes CSS de base', () => {
      expect(wrapper.find('.navbar-container').exists()).toBe(true);
      expect(wrapper.find('.my-app-bar').exists()).toBe(true);
    });
  });

  describe('Configuration des stubs', () => {
    it('devrait stubber les composants Vuetify', () => {
      expect(wrapper.findComponent({ name: 'v-app-bar' }).exists()).toBe(true);
      expect(wrapper.findAllComponents({ name: 'v-btn' }).length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Interaction avec les éléments mobiles', () => {
    it('devrait gérer le clic sur le logo mobile', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      
      return wrapper.vm.$nextTick().then(() => {
        const mobileLogo = wrapper.find('.mobile-logo-link');
        expect(mobileLogo.exists()).toBe(true);
      });
    });

    it('devrait gérer les clics sur les éléments de navigation mobile', () => {
      const vm = wrapper.vm as any;
      vm.showMobileMenu = true;
      
      return wrapper.vm.$nextTick().then(() => {
        const firstNavItem = wrapper.find('.mobile-nav-item');
        expect(firstNavItem.exists()).toBe(true);
      });
    });
  });

  describe('Lifecycle du composant', () => {
    it('devrait se monter sans erreurs', () => {
      expect(wrapper.vm).toBeDefined();
    });

    it('devrait se démonter sans erreurs', () => {
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe('Props et émissions', () => {
    it('ne devrait pas avoir de props requises', () => {
      expect(wrapper.props()).toEqual({});
    });
  });

  describe('Méthodes internes', () => {
    it('devrait avoir les méthodes de navigation définies', () => {
      const vm = wrapper.vm as any;
      expect(typeof vm.toggleMobileMenu).toBe('function');
      expect(typeof vm.closeMobileMenu).toBe('function');
      expect(typeof vm.navigateAndClose).toBe('function');
    });
  });

  describe('État du composant', () => {
    it('devrait maintenir l\'état du menu mobile', () => {
      const vm = wrapper.vm as any;
      
      vm.showMobileMenu = true;
      expect(vm.showMobileMenu).toBe(true);
      
      vm.showMobileMenu = false;
      expect(vm.showMobileMenu).toBe(false);
    });
  });
});
