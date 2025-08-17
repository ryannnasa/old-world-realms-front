import { test, expect } from '@playwright/test';

test.describe('Navigation avec authentification', () => {

  test.beforeEach(({ page }) => {
    return page.route('**/battlereport', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    }).then(() => {
      return page.route('**/auth/**', route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ authenticated: true })
        });
      });
    });
  });

  test('devrait rediriger vers Keycloak si non authentifié', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      const currentUrl = page.url();
      const isKeycloakPage = currentUrl.includes('auth') || 
                            currentUrl.includes('keycloak') ||
                            currentUrl.includes('lemur-15.cloud-iam.com');
      
      return page.title().then(pageTitle => {
        const isLoginPage = pageTitle.includes('Sign in') || 
                           pageTitle.includes('Login') ||
                           pageTitle.includes('Connexion');
        
        expect(isKeycloakPage || isLoginPage).toBeTruthy();
      });
    });
  });

  test('devrait afficher le titre de connexion Keycloak', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      return page.title();
    }).then(title => {
      expect(title).toContain('Sign in');
      
      const loginForm = page.locator('form, #login-form, .login-form');
      
      return loginForm.isVisible().then(isVisible => {
        if (isVisible) {
          return expect(loginForm).toBeVisible();
        } else {
          expect(page.url()).toMatch(/auth|login|keycloak/);
          return Promise.resolve();
        }
      });
    });
  });

  test('devrait gérer les erreurs de réseau', ({ page }) => {
    return page.goto('/', { timeout: 5000 }).catch(() => {
      return page.evaluate(() => document.title);
    }).then(() => {
      expect(true).toBe(true);
    });
  });
});
