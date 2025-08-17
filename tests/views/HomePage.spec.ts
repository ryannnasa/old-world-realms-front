import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import HomePage from '@/views/HomePage.vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Mock des stores
vi.mock('@/stores/battleReport', () => ({
  useBattleReportStore: () => ({
    battleReports: [],
    fetchBattleReportByUserId: vi.fn().mockResolvedValue([])
  }),
  battleReportUtils: {
    formatDate: vi.fn().mockReturnValue('01/01/2024')
  }
}));

vi.mock('@/stores/armyPhoto', () => ({
  useArmyPhotoStore: () => ({
    getArmyPhoto: vi.fn().mockResolvedValue([])
  })
}));

vi.mock('@/stores/armyName', () => ({
  useArmyNameStore: () => ({
    getArmyName: vi.fn().mockResolvedValue([])
  })
}));

vi.mock('@/stores/alliance', () => ({
  useAllianceStore: () => ({
    getAlliance: vi.fn().mockResolvedValue([])
  })
}));

vi.mock('@/stores/scenario', () => ({
  useScenarioStore: () => ({
    scenarios: [],
    getScenario: vi.fn().mockResolvedValue([])
  })
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    profile: { id: 1 },
    isAuthenticated: true
  })
}));

describe('HomePage - Tests unitaires', () => {
  let wrapper: VueWrapper<any>;
  let pinia: any;
  let router: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    // Créer un router mock
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: 'div' } }
      ]
    });

    wrapper = mount(HomePage, {
      global: {
        plugins: [pinia, router],
        stubs: {
          'BattleReportCards': true,
          'v-container': true,
          'v-carousel': true,
          'v-carousel-item': true,
          'v-img': true,
          'v-btn': true,
          'v-icon': true,
          'v-divider': true,
          'v-row': true,
          'v-col': true
        }
      }
    });
  });

  it('devrait se monter correctement', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('devrait avoir la structure HTML de base', () => {
    expect(wrapper.html()).toContain('v-container');
  });
});
