/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/testSetup.ts'],
    css: false,
    include: ['tests/unit/**/*.spec.ts', 'tests/components/**/*.spec.ts', 'tests/stores/**/*.spec.ts', 'tests/views/**/*.spec.ts'],
    exclude: ['tests/e2e/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      exclude: [
        // Stores non utilisés dans le projet
        'src/stores/alliance.ts',
        'src/stores/armyComposition.ts',
        'src/stores/armyName.ts',
        'src/stores/armyPhoto.ts',
        'src/stores/attachedUnit.ts',
        'src/stores/mainTroopType.ts',
        'src/stores/mount.ts',
        'src/stores/mountDescription.ts',
        'src/stores/mountRule.ts',
        'src/stores/mountUnit.ts',
        'src/stores/mountedUnitPhoto.ts',
        'src/stores/player.ts',
        'src/stores/pointsCases.ts',
        'src/stores/pointsType.ts',
        'src/stores/pointsTypeHasMountUnit.ts',
        'src/stores/pointsTypeHasUnit.ts',
        'src/stores/principalUnitName.ts',
        'src/stores/troopType.ts',
        'src/stores/unit.ts',
        'src/stores/unitDescription.ts',
        'src/stores/unitName.ts',
        'src/stores/unitPhoto.ts',
        'src/stores/unitType.ts',
        // Fichiers de configuration
        'src/main.ts',
        'src/keycloak-config.ts',
        'src/router/index.ts',
        // Pages légales statiques
        'src/views/Cgu.vue',
        'src/views/Confidentiality.vue',
        'src/views/Legal.vue',
        // Configuration Playwright
        'playwright.config.ts',
        // Fichiers de test
        'tests/**',
        // Dossiers de build et configuration
        'dist/**',
        'node_modules/**',
        '*.config.*'
      ],
      include: [
        'src/stores/auth.ts',
        'src/stores/army.ts',
        'src/stores/battleReport.ts',
        'src/stores/scenario.ts',
        'src/components/**/*.vue',
        'src/views/**/*.vue'
      ]
    },
    deps: {
      inline: ['vuetify']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
