import { test, expect } from '@playwright/test';
import { mockBattleReportsE2E } from '../fixtures/battleReports';

test.describe('Battle Reports - Affichage et Navigation', () => {
  
  test.beforeEach(({ page }) => {
    return page.route('**/battlereport', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBattleReportsE2E)
      });
    }).then(() => {
      return page.route('**/armyname', route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
    }).then(() => {
      return page.route('**/scenario', route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
    });
  });

  test('devrait afficher la page d\'accueil avec les battle reports', ({ page }) => {
    return page.goto('/').then(() => {
      return expect(page).toHaveTitle(/Old World Realms/);
    }).then(() => {
      return expect(page.locator('header')).toBeVisible();
    }).then(() => {
      return page.waitForSelector('.battle-card', { timeout: 10000 });
    }).then(() => {
      const battleCards = page.locator('.battle-card');
      return expect(battleCards).toHaveCount(3);
    }).then(() => {
      const firstCard = page.locator('.battle-card').first();
      return expect(firstCard).toContainText('La Bataille de l\'Aube Sanglante');
    }).then(() => {
      const firstCard = page.locator('.battle-card').first();
      return expect(firstCard).toContainText('2000 points');
    }).then(() => {
      const firstCard = page.locator('.battle-card').first();
      return expect(firstCard).toContainText('Bataille rangée');
    });
  });

  test('devrait naviguer vers la page de tous les battle reports', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForSelector('.battle-card');
    }).then(() => {
      return page.goto('/battlereports');
    }).then(() => {
      return page.waitForSelector('.battle-card');
    }).then(() => {
      const battleCards = page.locator('.battle-card');
      return expect(battleCards).toHaveCount(3);
    });
  });

  test('devrait afficher les détails d\'un battle report', ({ page }) => {
    return page.route('**/battlereport/1', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBattleReportsE2E[0])
      });
    }).then(() => {
      return page.goto('/');
    }).then(() => {
      return page.waitForSelector('.battle-card');
    }).then(() => {
      const firstCard = page.locator('.battle-card').first();
      return firstCard.click();
    }).then(() => {
      return expect(page).toHaveURL(/.*battlereport\/\d+/);
    });
  });

  test('devrait afficher correctement les filtres sur mobile', ({ page }) => {
    return page.setViewportSize({ width: 375, height: 667 }).then(() => {
      return page.goto('/battlereports');
    }).then(() => {
      return page.waitForSelector('.battle-card');
    }).then(() => {
      const battleCards = page.locator('.battle-card');
      return expect(battleCards).toHaveCount(3);
    }).then(() => {
      const firstCard = page.locator('.battle-card').first();
      return firstCard.boundingBox().then(cardBox => {
        expect(cardBox?.width).toBeLessThan(375);
      });
    });
  });

  test('devrait gérer les erreurs de chargement des battle reports', ({ page }) => {
    return page.route('**/battlereport', route => {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Erreur serveur' })
      });
    }).then(() => {
      return page.goto('/');
    }).then(() => {
      const errorMessage = page.locator('text=Erreur').or(page.locator('text=Aucun rapport'));
      return expect(errorMessage).toBeVisible({ timeout: 10000 });
    }).then(() => {
      const battleCards = page.locator('.battle-card');
      return expect(battleCards).toHaveCount(0);
    });
  });
});
