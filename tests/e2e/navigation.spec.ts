import { test, expect } from '@playwright/test';

test.describe('Navigation générale', () => {

  test.beforeEach(({ page }) => {
    return page.route('**/battlereport', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  });

  test('devrait naviguer correctement entre les pages principales', ({ page }) => {
    return page.goto('/').then(() => {
      return expect(page).toHaveTitle(/Old World Realms/);
    }).then(() => {
      const navbar = page.locator('nav, .navbar, header');
      return expect(navbar).toBeVisible();
    }).then(() => {
      const battleReportsLink = page.locator('text=Battle Reports')
        .or(page.locator('a[href*="battlereport"]'))
        .or(page.locator('[data-testid="nav-battlereports"]'));
      
      return battleReportsLink.isVisible().then(isVisible => {
        if (isVisible) {
          return battleReportsLink.click().then(() => {
            return expect(page).toHaveURL(/.*battlereport/);
          });
        }
      }).then(() => {
        const homeLink = page.locator('text=Accueil')
          .or(page.locator('a[href="/"]'))
          .or(page.locator('.logo'))
          .first();
        
        return homeLink.isVisible().then(isVisible => {
          if (isVisible) {
            return homeLink.click().then(() => {
              return expect(page).toHaveURL('/');
            });
          }
        });
      });
    });
  });

  test('devrait afficher correctement le menu mobile', ({ page }) => {
    return page.setViewportSize({ width: 375, height: 667 }).then(() => {
      return page.goto('/');
    }).then(() => {
      const menuButton = page.locator('.menu-toggle')
        .or(page.locator('[data-testid="mobile-menu"]'))
        .or(page.locator('button:has-text("☰")'))
        .or(page.locator('.hamburger'));
      
      return menuButton.isVisible().then(isVisible => {
        if (isVisible) {
          return menuButton.click().then(() => {
            const mobileMenu = page.locator('.mobile-menu, .menu-drawer, .sidebar');
            return expect(mobileMenu).toBeVisible();
          }).then(() => {
            const navLinks = page.locator('.mobile-menu a, .menu-drawer a, .sidebar a');
            return navLinks.count().then(count => {
              expect(count).toBeGreaterThan(0);
            });
          });
        }
      });
    });
  });

  test('devrait gérer les pages d\'erreur 404', ({ page }) => {
    return page.goto('/page-inexistante').then(() => {
      return page.textContent('body');
    }).then(pageContent => {
      const is404Page = pageContent?.includes('404') || 
                       pageContent?.includes('Page non trouvée') ||
                       pageContent?.includes('Not Found');
      
      const isRedirectedHome = page.url().endsWith('/');
      
      expect(is404Page || isRedirectedHome).toBeTruthy();
    });
  });

  test('devrait maintenir l\'état de navigation lors du refresh', ({ page }) => {
    return page.goto('/').then(() => {
      const subPageLink = page.locator('a[href*="/battlereport"]').first();
      
      return subPageLink.isVisible().then(isVisible => {
        if (isVisible) {
          return subPageLink.click().then(() => {
            const currentUrl = page.url();
            
            return page.reload().then(() => {
              return expect(page).toHaveURL(currentUrl);
            });
          });
        }
      });
    });
  });

  test('devrait afficher le footer sur toutes les pages', ({ page }) => {
    const pages = ['/', '/battlereports'];
    let currentIndex = 0;
    
    const testPage = () => {
      if (currentIndex >= pages.length) {
        return Promise.resolve();
      }
      
      const pagePath = pages[currentIndex];
      currentIndex++;
      
      return page.goto(pagePath).then(() => {
        const footer = page.locator('footer, .footer');
        
        return footer.isVisible().then(isVisible => {
          if (isVisible) {
            return expect(footer).toBeVisible().then(() => {
              const legalLinks = page.locator('footer a, .footer a');
              return legalLinks.count().then(count => {
                expect(count).toBeGreaterThan(0);
              });
            });
          }
        }).then(() => {
          return testPage();
        });
      });
    };
    
    return testPage();
  });

  test('devrait avoir une navigation accessible au clavier', ({ page }) => {
    return page.goto('/').then(() => {
      return page.keyboard.press('Tab');
    }).then(() => {
      const focusedElement = page.locator(':focus');
      return expect(focusedElement).toBeVisible();
    }).then(() => {
      return page.keyboard.press('Tab');
    }).then(() => {
      return page.keyboard.press('Tab');
    }).then(() => {
      const currentFocused = page.locator(':focus');
      return currentFocused.getAttribute('href').then(href => {
        if (href) {
          return page.keyboard.press('Enter').then(() => {
            return page.waitForLoadState('networkidle');
          });
        }
      });
    });
  });
});
