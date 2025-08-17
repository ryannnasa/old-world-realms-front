import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests d'intégration Frontend
 * Tests End-to-End pour Old World Realms
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Configuration globale */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter pour les résultats */
  reporter: 'html',
  
  /* Configuration partagée pour tous les tests */
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Timeout plus long pour gérer les redirections auth */
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  /* Configuration des projets pour différents navigateurs */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    /* Tests mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Serveur de développement local */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
