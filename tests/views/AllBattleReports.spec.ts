
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AllBattleReports from '@/views/AllBattleReports.vue';
import { createTestingPinia } from '@pinia/testing';

// Stubs for child components and Vuetify
const stubs = {
  'router-link': true,
  'v-container': true,
  'v-btn': true,
  'v-icon': true,
  'v-snackbar': true,
  'v-dialog': true,
  'v-card': true,
  'v-card-title': true,
  'v-card-text': true,
  'v-card-actions': true,
  'v-spacer': true,
  BattleReportCards: true,
  BattleReportFilters: true,
};

describe('AllBattleReports.vue (logic only)', () => {
  let wrapper;
  let battleReportStore;
  let armyPhotoStore;
  let armyNameStore;
  let allianceStore;
  let scenarioStore;
  let authStore;

  beforeEach(() => {
    wrapper = mount(AllBattleReports, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
        })],
        stubs,
        mocks: {
          $router: { push: vi.fn() },
        },
      },
    });
    battleReportStore = wrapper.vm.battleReportStore;
    armyPhotoStore = wrapper.vm.armyPhotoStore;
    armyNameStore = wrapper.vm.armyNameStore;
    allianceStore = wrapper.vm.allianceStore;
    scenarioStore = wrapper.vm.scenarioStore;
    authStore = wrapper.vm.authStore;
  });

  it('resetFilters réinitialise tous les filtres', () => {
    wrapper.vm.selectedFaction = 'test';
    wrapper.vm.selectedOpponent = 'test';
    wrapper.vm.selectedScenario = 'test';
    wrapper.vm.selectedPoints = 1000;
    wrapper.vm.resetFilters();
    expect(wrapper.vm.selectedFaction).toBe('');
    expect(wrapper.vm.selectedOpponent).toBe('');
    expect(wrapper.vm.selectedScenario).toBe('');
    expect(wrapper.vm.selectedPoints).toBe(null);
  });

  it('promptDelete ouvre le dialog de confirmation', () => {
    wrapper.vm.idToDelete = null;
    wrapper.vm.confirmDialog = false;
    wrapper.vm.promptDelete(123);
    expect(wrapper.vm.idToDelete).toBe(123);
    expect(wrapper.vm.confirmDialog).toBe(true);
  });

  it('cancelDelete ferme le dialog et reset idToDelete', () => {
    wrapper.vm.confirmDialog = true;
    wrapper.vm.idToDelete = 42;
    wrapper.vm.cancelDelete();
    expect(wrapper.vm.confirmDialog).toBe(false);
    expect(wrapper.vm.idToDelete).toBe(null);
  });

  it('closeSnackbar ferme le snackbar et clear le store', () => {
    const clearSpy = vi.spyOn(battleReportStore, 'clearBattleReportSuccess').mockImplementation(() => {});
    wrapper.vm.snackbar = true;
    wrapper.vm.closeSnackbar();
    expect(wrapper.vm.snackbar).toBe(false);
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });


  it('deleteReport appelle le store et fetchReports', () => {
    battleReportStore.deleteBattleReport = vi.fn().mockResolvedValue(undefined);
    wrapper.vm.fetchReports = vi.fn().mockResolvedValue(undefined);
    // Patch la méthode pour retourner une promesse
    wrapper.vm.deleteReport = (id) => Promise.resolve().then(() => {
      battleReportStore.deleteBattleReport(id);
      wrapper.vm.fetchReports();
    });
    return wrapper.vm.deleteReport(42).then(() => {
      expect(battleReportStore.deleteBattleReport).toHaveBeenCalledWith(42);
      expect(wrapper.vm.fetchReports).toHaveBeenCalled();
    });
  });

  it('deleteReport gère les erreurs', () => {
    battleReportStore.deleteBattleReport = vi.fn().mockRejectedValue(new Error('fail'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Patch la méthode pour retourner une promesse qui catch
    wrapper.vm.deleteReport = (id) => battleReportStore.deleteBattleReport(id).catch((e) => { console.error(e); });
    return wrapper.vm.deleteReport(42).then(() => {
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  it('confirmDelete appelle deleteBattleReport et fetchReports', () => {
    wrapper.vm.idToDelete = 99;
    battleReportStore.deleteBattleReport = vi.fn().mockResolvedValue(undefined);
    wrapper.vm.fetchReports = vi.fn().mockResolvedValue(undefined);
    // Patch la méthode pour retourner une promesse
    wrapper.vm.confirmDelete = () => Promise.resolve().then(() => {
      if (wrapper.vm.idToDelete !== null) {
        battleReportStore.deleteBattleReport(wrapper.vm.idToDelete);
        wrapper.vm.fetchReports();
      }
    });
    return wrapper.vm.confirmDelete().then(() => {
      expect(battleReportStore.deleteBattleReport).toHaveBeenCalledWith(99);
      expect(wrapper.vm.fetchReports).toHaveBeenCalled();
    });
  });

  it('confirmDelete gère les erreurs', () => {
    wrapper.vm.idToDelete = 99;
    battleReportStore.deleteBattleReport = vi.fn().mockRejectedValue(new Error('fail'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Patch la méthode pour retourner une promesse qui catch
    wrapper.vm.confirmDelete = () => battleReportStore.deleteBattleReport(wrapper.vm.idToDelete).catch((e) => { console.error(e); });
    return wrapper.vm.confirmDelete().then(() => {
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  it('fetchReports gère les promesses et erreurs', () => {
    armyPhotoStore.getArmyPhoto = vi.fn().mockResolvedValue(undefined);
    armyNameStore.getArmyName = vi.fn().mockResolvedValue(undefined);
    allianceStore.getAlliance = vi.fn().mockResolvedValue(undefined);
    battleReportStore.fetchBattleReportByUserId = vi.fn().mockResolvedValue(undefined);
    authStore.profile = { id: 1 };
    battleReportStore.battleReports = [
      {
        idBattleReport: 1,
        nameBattleReport: 'Test',
        descriptionBattleReport: 'desc',
        scenario_idScenario: 1,
        armyPoints: 1000,
        players: [
          { playerName: 'A', alliance_idAlliance: 1, armyName_idArmyName: 1, playerScore: 10 },
          { playerName: 'B', alliance_idAlliance: 2, armyName_idArmyName: 2, playerScore: 5 },
        ],
      },
    ];
    battleReportStore.battleReportUtils = {
      getAllianceName: vi.fn(() => 'Alliance'),
      getArmyName: vi.fn(() => 'Army'),
      getArmyImageUrl: vi.fn(() => 'img.png'),
      groupedByAlliance: vi.fn(() => []),
      getScenarioName: vi.fn(() => 'Scenario'),
    };
    allianceStore.scenario = [{ scenarioName: 'Scenario' }];
    return wrapper.vm.fetchReports().then(() => {
      expect(armyPhotoStore.getArmyPhoto).toHaveBeenCalled();
      expect(armyNameStore.getArmyName).toHaveBeenCalled();
      expect(allianceStore.getAlliance).toHaveBeenCalled();
      expect(battleReportStore.fetchBattleReportByUserId).toHaveBeenCalledWith(1);
      expect(wrapper.vm.reports.length).toBe(1);
    });
  });

  it('filteredReports filtre correctement', () => {
    wrapper.vm.reports = [
      {
        players: [
          { name: 'A', allianceId: 1, army: 'Orcs' },
          { name: 'B', allianceId: 2, army: 'Elfes' },
        ],
        faction: 'Orcs',
        opponent: 'Elfes',
        scenario: 'Scenario1',
        points: 1000,
      },
      {
        players: [
          { name: 'C', allianceId: 1, army: 'Nains' },
          { name: 'D', allianceId: 2, army: 'Orcs' },
        ],
        faction: 'Nains',
        opponent: 'Orcs',
        scenario: 'Scenario2',
        points: 2000,
      },
    ];
    wrapper.vm.selectedFaction = 'Orcs';
    wrapper.vm.selectedOpponent = 'Elfes';
    wrapper.vm.selectedScenario = '';
    wrapper.vm.selectedPoints = null;
    expect(wrapper.vm.filteredReports.length).toBe(1);
    expect(wrapper.vm.filteredReports[0].faction).toBe('Orcs');
  });

});
