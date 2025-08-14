# Tests Unitaires - Old World Realms

## Configuration et utilisation

### Installation des dépendances de test

Pour installer les dépendances nécessaires aux tests, exécutez :

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

## Structure des tests

### Tests du Store BattleReport

Le fichier `tests/stores/battleReport.basic.spec.ts` contient les tests unitaires pour le store principal de l'application.

#### Tests couverts :

1. **État initial** - Vérification que le store s'initialise correctement
2. **getBattleReport()** - Test de récupération de la liste des rapports
3. **fetchBattleReportById()** - Test de récupération d'un rapport spécifique
4. **deleteBattleReport()** - Test de suppression d'un rapport
5. **Gestion d'erreurs** - Tests des cas d'erreur API

#### Exemple d'exécution d'un test :

```typescript
describe("getBattleReport", () => {
  it("devrait récupérer la liste des battle reports", () => {
    const mockData = [
      {
        idBattleReport: 1,
        nameBattleReport: "Test Battle",
        descriptionBattleReport: "Description test",
        armyPoints: 1000,
      },
    ];

    // Mock de la réponse fetch
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    return store.getBattleReport().then(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/battlereport"
      );
      expect(store.battleReports).toEqual(mockData);
    });
  });
});
```

### Mocks et données de test

- **`tests/setup.ts`** - Configuration globale des tests
- **`tests/__mocks__/mockData.ts`** - Données de test réutilisables
- **Mock de fetch** - Simulation des appels API
- **Mock de localStorage** - Simulation du stockage local

## Avantages de cette approche

### 🎯 **Tests du Store (ViewModel global)**

- **Couverture maximale** - Tests de toute la logique métier
- **Isolation** - Chaque test est indépendant
- **Performance** - Pas de rendu DOM, tests rapides
- **Fiabilité** - Détection précoce des régressions

### ✅ **Bonnes pratiques implémentées**

- **Beforeach** - Nettoyage entre les tests
- **Mocking complet** - fetch, localStorage, console
- **Tests d'erreur** - Gestion des cas d'échec
- **Assertions claires** - Vérifications précises

### 📊 **Métriques de test**

- **Couverture du code** - Rapport automatique
- **Temps d'exécution** - Optimisé pour la rapidité
- **Interface graphique** - Visualisation avec `npm run test:ui`

## Extension des tests

Pour ajouter de nouveaux tests :

1. Créer un nouveau fichier `.spec.ts` dans le dossier approprié
2. Importer les utilitaires de test de Vitest
3. Utiliser les mocks existants ou en créer de nouveaux
4. Suivre la convention de nommage : `describe` → `it` → `expect`

Cette configuration de test vous permettra de maintenir la qualité de votre architecture MVVM et de détecter rapidement les régressions lors du développement de nouvelles fonctionnalités.
