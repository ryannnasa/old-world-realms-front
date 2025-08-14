# Tests Unitaires - Warhammer Battle Reports

## 📋 Vue d'ensemble

Ce document décrit la stratégie de tests unitaires mise en place pour le projet Warhammer Battle Reports, spécifiquement orientée vers la validation de l'architecture MVVM.

## 🏗️ Architecture de tests

### Structure des fichiers de tests

```
tests/
├── setup.ts                           # Configuration globale
├── stores/
│   └── battleReport.spec.ts           # Tests complets du store (14 tests)
└── components/
    └── BattleReportCards.spec.ts       # Tests du composant (18 tests)
```

### Configuration et installation

Pour installer les dépendances nécessaires aux tests :

```bash
npm install --save-dev vitest @vue/test-utils jsdom @vitest/ui @vitest/coverage-c8
```

### Commandes de test disponibles

```bash
# Exécuter tous les tests en mode watch
npm run test

# Exécuter les tests une seule fois
npm run test:run

# Interface utilisateur pour les tests
npm run test:ui

# Exécuter les tests avec couverture de code
npm run test:coverage
```

- **Framework** : Vitest avec jsdom
- **Outils** : @vue/test-utils, Pinia
- **Configuration** : `vitest.config.ts`

## 🎯 Tests du store battleReport

### Couverture fonctionnelle

#### 1. État initial

- ✅ Validation des valeurs par défaut du store
- ✅ Vérification de l'initialisation correcte

#### 2. Actions CRUD

- ✅ `getBattleReport()` - Récupération de la liste
- ✅ `fetchBattleReportById()` - Récupération par ID
- ✅ `deleteBattleReport()` - Suppression avec mise à jour du state
- ✅ `uploadPhotos()` - Upload de fichiers

#### 3. Gestion des erreurs

- ✅ Erreurs réseau (fetch failed)
- ✅ Erreurs HTTP (404, 500)
- ✅ Validation des logs d'erreur

#### 4. Utilitaires

- ✅ `getArmyName()` - Résolution de nom d'armée
- ✅ `groupedByAlliance()` - Groupement par alliance

## 🎨 Tests du composant BattleReportCards

### Couverture fonctionnelle

#### 1. Rendu en mode Grid (5 tests)

- ✅ Nombre correct de cartes affichées
- ✅ Titres des batailles affichés correctement
- ✅ Points des batailles affichés
- ✅ Noms des joueurs dans les sous-titres
- ✅ Liens router-link générés

#### 2. Rendu en mode Carousel (3 tests)

- ✅ Carousel wrapper présent
- ✅ Composant v-window affiché
- ✅ Calcul correct des chunks de pagination

#### 3. Actions et événements (2 tests)

- ✅ Boutons d'action affichés/cachés selon la prop `showActions`
- ✅ Gestion de l'affichage conditionnel

#### 4. Props par défaut (3 tests)

- ✅ Mode grid par défaut
- ✅ Actions affichées par défaut
- ✅ ItemsPerPage = 3 par défaut

#### 5. Gestion des cas limites (3 tests)

- ✅ Liste vide de rapports
- ✅ Rapports avec plus de 4 joueurs
- ✅ Images d'armée manquantes

#### 6. Computed properties (2 tests)

- ✅ Calcul correct de `chunkedReports` en mode carousel
- ✅ Tableau vide en mode grid

### Exemples de tests clés

#### Tests de store (battleReport)

```typescript
// Test d'action avec mock API
it("devrait récupérer la liste des battle reports avec succès", () => {
  const mockData = [
    /* données simulées */
  ];

  vi.mocked(global.fetch).mockResolvedValueOnce({
    json: () => Promise.resolve(mockData),
  } as Response);

  return store.getBattleReport().then(() => {
    expect(store.battleReports).toEqual(mockData);
  });
});

// Test de gestion d'erreur
it("devrait gérer les erreurs de l'API", () => {
  vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Erreur réseau"));

  return store.getBattleReport().then(() => {
    expect(store.battleReports).toEqual([]);
  });
});
```

#### Tests de composant (BattleReportCards)

```typescript
// Test de rendu
it("devrait rendre le bon nombre de cartes", () => {
  const cards = wrapper.findAll(".battle-card");
  expect(cards).toHaveLength(mockBattleReports.length);
});

// Test de props
it("devrait utiliser le mode grid par défaut", () => {
  const gridContainer = wrapper.find(".v-row");
  expect(gridContainer.exists()).toBe(true);
});

// Test de computed
it("devrait calculer chunkedReports correctement en mode carousel", () => {
  const component = wrapper.vm;
  expect(component.chunkedReports).toHaveLength(2);
});
```

## 🔧 Configuration et utilisation

### Installation des dépendances

```bash
npm install -D vitest @vue/test-utils jsdom @vitest/ui
```

### Scripts disponibles

```bash
# Tests en mode watch
npm run test

# Tests en mode run (sans watch)
npm run test:run

# Interface utilisateur pour les tests
npm run test:ui

# Tests avec couverture de code
npm run test:coverage
```

### Mocks utilisés

#### localStorage

```typescript
const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
```

#### fetch API

```typescript
global.fetch = vi.fn();

// Dans les tests
vi.mocked(global.fetch).mockResolvedValueOnce({
  json: () => Promise.resolve(mockData),
} as Response);
```

#### Stubs Vuetify (pour composants)

```typescript
const vuetifyStubs = {
  "v-card": { template: '<div class="v-card battle-card"><slot /></div>' },
  "v-btn": {
    template:
      '<button class="v-btn button" @click="handleClick"><slot /></button>',
    methods: {
      handleClick() {
        this.$emit("click");
      },
    },
  },
  "router-link": { template: "<a><slot /></a>", props: ["to"] },
};
```

## 📊 Résultats actuels

### Statistiques

- ✅ **32 tests** passent avec succès (14 store + 18 composant)
- ⏱️ **Durée d'exécution** : ~1.07s
- 📁 **2 fichiers de test** configurés
- 🎯 **Couverture** : Store battleReport + Composant BattleReportCards

### Validation MVVM

Les tests valident efficacement :

- **Model** : Interfaces et types TypeScript
- **View** : Rendu des composants Vue avec props/events
- **ViewModel** : Logique métier dans les stores Pinia

### Détail par fichier

- **battleReport.spec.ts** : 14 tests (stores, utilitaires, API calls)
- **BattleReportCards.spec.ts** : 18 tests (rendu, props, computed, cas limites)

## � Métriques et bonnes pratiques

### ✅ **Bonnes pratiques implémentées**

- **beforeEach** - Nettoyage entre les tests
- **Mocking complet** - fetch, localStorage, console
- **Tests d'erreur** - Gestion des cas d'échec
- **Assertions claires** - Vérifications précises
- **Isolation** - Chaque test est indépendant

### 📈 **Avantages de cette approche**

- **Couverture maximale** - Tests de toute la logique métier
- **Performance** - Pas de rendu DOM inutile, tests rapides
- **Fiabilité** - Détection précoce des régressions
- **Interface graphique** - Visualisation avec `npm run test:ui`

## �🚀 Extensions futures

### Tests de composants recommandés

1. **BattleReportFilters.vue** (prochaine priorité)

   - Formulaires réactifs
   - Responsive design
   - État des filtres
   - Événements de filtrage

2. **Navbar.vue**

   - Navigation responsive
   - États d'authentification
   - Menu mobile

3. **Tests d'intégration**
   - Navigation entre pages
   - Flux utilisateur complet

## 🔧 Extension des tests

Pour ajouter de nouveaux tests :

1. Créer un nouveau fichier `.spec.ts` dans le dossier approprié
2. Importer les utilitaires de test de Vitest
3. Utiliser les mocks existants ou en créer de nouveaux
4. Suivre la convention de nommage : `describe` → `it` → `expect`

Cette configuration de test permet de maintenir la qualité de l'architecture MVVM et de détecter rapidement les régressions lors du développement.

- Interaction store-composant

### Métriques de qualité

- **Coverage** : Ajouter `--coverage` pour analyser la couverture
- **Performance** : Tests de performance des stores
- **Accessibilité** : Tests a11y avec @testing-library
- **E2E** : Tests end-to-end avec Playwright

## 💡 Bonnes pratiques appliquées

1. **Isolation** : Chaque test est indépendant avec `beforeEach`
2. **Mocking** : APIs externes et composants Vuetify mockés
3. **Assertions** : Vérifications précises des états et comportements
4. **Documentation** : Tests auto-documentés avec descriptions claires
5. **Maintenance** : Configuration simple et extensible
6. **Stubs intelligents** : Composants Vuetify stubés pour éviter les conflits CSS

---

_Cette stratégie de tests garantit la robustesse de l'architecture MVVM et facilite la maintenance future du projet._
