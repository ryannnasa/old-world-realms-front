import { test, expect } from '@playwright/test';

test.describe('Tests de base - Old World Realms', () => {

  test('devrait charger la page et avoir un titre correct', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      return page.title();
    }).then(title => {
      expect(title.length).toBeGreaterThan(0);
      
      console.log('Titre de la page:', title);
      console.log('URL actuelle:', page.url());
    });
  });

  test('devrait avoir une structure HTML basique', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      const body = page.locator('body');
      return expect(body).toBeVisible().then(() => {
        const app = page.locator('#app');
        return app.isVisible().then(isVisible => {
          if (isVisible) {
            return expect(app).toBeVisible();
          }
        }).then(() => {
          return body.innerHTML();
        }).then(bodyContent => {
          console.log('Contenu body (premiers 200 caractères):', bodyContent.substring(0, 200));
        });
      });
    });
  });

  test('devrait répondre aux requêtes HTTP de base', ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
      console.log('Requête:', request.method(), request.url());
    });
    
    page.on('response', response => {
      console.log('Réponse:', response.status(), response.url());
    });
    
    return page.goto('/').then(() => {
      return page.waitForTimeout(3000);
    }).then(() => {
      expect(requests.length).toBeGreaterThan(0);
      
      const hasBaseRequest = requests.some(url => 
        url.includes('localhost:5173') || url.includes('/')
      );
      expect(hasBaseRequest).toBeTruthy();
    });
  });

  test('devrait avoir du contenu dans la page', ({ page }) => {
    return page.goto('/').then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      return page.waitForTimeout(2000);
    }).then(() => {
      return page.locator('body').textContent();
    }).then(bodyText => {
      expect(bodyText?.length || 0).toBeGreaterThan(10);
      console.log('Contenu textuel (premiers 300 caractères):', bodyText?.substring(0, 300));
    });
  });

  test('devrait être responsive', ({ page }) => {
    return page.setViewportSize({ width: 1920, height: 1080 }).then(() => {
      return page.goto('/');
    }).then(() => {
      return page.waitForLoadState('networkidle');
    }).then(() => {
      return page.locator('body').boundingBox();
    }).then(body => {
      expect(body?.width).toBeGreaterThan(1000);
      
      return page.setViewportSize({ width: 375, height: 667 });
    }).then(() => {
      return page.waitForTimeout(1000);
    }).then(() => {
      return page.locator('body').boundingBox();
    }).then(body => {
      expect(body?.width).toBeLessThanOrEqual(375);
    });
  });
});
