# Tests d'intégration Frontend - Old World Realms

## Vue d'ensemble

Tests End-to-End (E2E) utilisant **Playwright** pour valider l'expérience utilisateur complète de l'application Old World Realms.

## Configuration

### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Commandes disponibles

```bash
# Exécuter tous les tests E2E
npm run test:e2e

# Interface utilisateur pour les tests E2E
npm run test:e2e:ui

# Exécuter avec navigateurs visibles
npm run test:e2e:headed

# Mode debug (pause sur échec)
npm run test:e2e:debug
```

## Structure des tests

```
tests/
├── e2e/                        # Tests End-to-End
│   ├── battleReports.spec.ts   # Tests des Battle Reports
│   └── navigation.spec.ts      # Tests de navigation
├── fixtures/                   # Données de test
│   └── battleReports.ts        # Mock data pour E2E
└── unit/                       # Tests unitaires existants
    ├── stores/
    └── components/
```

## Types de tests implémentés

### 1. Tests des Battle Reports (`battleReports.spec.ts`)

**Couverture :** 5 tests sur 5 navigateurs = **25 tests**

- ✅ Affichage de la page d'accueil avec les battle reports
- ✅ Navigation vers la page de tous les battle reports
- ✅ Affichage des détails d'un battle report
- ✅ Filtres en mode mobile (responsive)
- ✅ Gestion des erreurs de chargement

**Exemple de test :**

```typescript
test("devrait afficher la page d'accueil avec les battle reports", async ({
  page,
}) => {
  await page.goto("/");

  // Vérification du titre
  await expect(page).toHaveTitle(/Old World Realms/);

  // Attendre le chargement des battle reports
  await page.waitForSelector(".battle-card");

  // Vérification du nombre de cartes
  const battleCards = page.locator(".battle-card");
  await expect(battleCards).toHaveCount(3);

  // Vérification du contenu
  await expect(battleCards.first()).toContainText(
    "La Bataille de l'Aube Sanglante"
  );
});
```

### 2. Tests de Navigation (`navigation.spec.ts`)

**Couverture :** 6 tests sur 5 navigateurs = **30 tests**

- ✅ Navigation entre pages principales
- ✅ Menu mobile responsive
- ✅ Gestion des erreurs 404
- ✅ Persistance de l'état lors du refresh
- ✅ Affichage du footer
- ✅ Navigation accessible au clavier

### Navigateurs testés

- **Desktop :** Chrome, Firefox, Safari
- **Mobile :** Chrome Mobile, Safari Mobile

## Fonctionnalités testées

### Mock des APIs

Les tests utilisent des mocks pour simuler les réponses du backend :

```typescript
// Mock de l'API battle reports
await page.route("**/battlereport", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockBattleReportsE2E),
  });
});
```

### Tests de responsivité

Configuration mobile automatique pour certains tests :

```typescript
test("devrait afficher correctement les filtres sur mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Tests spécifiques au mobile...
});
```

### Gestion des erreurs

Tests de résilience avec simulation d'erreurs serveur :

```typescript
// Mock d'erreur API
await page.route("**/battlereport", async (route) => {
  await route.fulfill({
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ error: "Erreur serveur" }),
  });
});
```

## Avantages des tests E2E

### ✅ **Validation complète de l'UX**

- Simulation d'utilisateurs réels
- Test de l'interface dans différents navigateurs
- Validation du comportement responsive

### ✅ **Tests cross-browser**

- Chrome, Firefox, Safari
- Desktop et mobile
- Détection des incompatibilités

### ✅ **Détection des régressions UI**

- Navigation cassée
- Éléments non visibles
- Performance dégradée

### ✅ **Confiance dans les déploiements**

- Validation avant mise en production
- Tests de bout en bout
- Couverture des parcours critiques

## Intégration dans le workflow

### Développement local

```bash
# Développement avec rechargement automatique
npm run dev

# Tests E2E en parallèle (autre terminal)
npm run test:e2e:headed
```

### CI/CD (futur)

```yaml
# Exemple GitHub Actions
- name: Run E2E tests
  run: npm run test:e2e
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Métriques actuelles

- **Tests E2E :** 55 tests (11 scénarios × 5 navigateurs)
- **Tests unitaires :** 32 tests (stores + composants)
- **Couverture totale :** 87 tests automatisés
- **Temps d'exécution E2E :** ~2-3 minutes

Cette configuration offre une couverture complète de votre application avec validation automatique de l'expérience utilisateur sur multiple plateformes.
