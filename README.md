# Old World Realms

<div align="center">
  <img src="public/img/Logo Old World Realms.png" alt="Old World Realms Logo" width="200"/>
  
  **Application de gestion de rapports de bataille pour Warhammer: The Old World**
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

## Table des matières

- [À propos](#à-propos)
- [Spécifications fonctionnelles](#spécifications-fonctionnelles)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Support](#support)
- [Licence](#licence)

## À propos

Old World Realms est une application web moderne dédiée aux passionnés de Warhammer: The Old World. Cette plateforme permet aux joueurs de créer, gérer et consulter des rapports de bataille détaillés avec un système complet de gestion des participants, des armées et des médias.

## Spécifications fonctionnelles

### RF-001 : Authentification et gestion des comptes

**Gestion complète de l'authentification sécurisée et des profils utilisateurs.**

- Acteurs : Utilisateur, Administrateur
- Système d'authentification basé sur Keycloak
- Création, modification et suppression de comptes
- Gestion des sessions sécurisées

### RF-002 : Création et édition de rapports de bataille

**Système complet de création et modification de rapports de bataille détaillés**

- Acteurs : Utilisateur
- Formulaire de création avec validation
- Upload de photos de bataille
- Gestion des joueurs participants
- Attribution des scores et résultats
- Sélection des armées et compositions

### RF-003 : Gestion avancée des joueurs

**Système de gestion des participants aux batailles avec leurs caractéristiques**

- Acteurs : Utilisateur
- Ajout de participants multiples (jusqu'à 10 joueurs)
- Sélection des armées et compositions
- Gestion des alliances
- Attribution des scores individuels

### RF-004 : Consultation et affichage des rapports

**Affichage structuré et attractif des rapports de bataille**

- Acteurs : Utilisateurs
- Vue détaillée de chaque rapport
- Galerie photos intégrée
- Informations complètes des participants
- Système de navigation intuitif

### RF-005 : Système de filtrage

**Outils de filtrage pour trouver des rapports spécifiques**

- Acteurs : Utilisateur
- Filtrage par faction jouée
- Filtrage par faction adverse
- Filtrage par scénario
- Filtrage par nombre de points
- Réinitialisation rapide des filtres

### RF-006 : Gestion des photos et médias

**Système complet de gestion des photos de bataille**

- Acteurs : Utilisateur
- Upload multiple de photos
- Prévisualisation des images
- Stockage sécurisé des médias
- Compression et optimisation automatiques

### RF-007 : Interface responsive et ergonomie

**Interface adaptative et expérience utilisateur optimisée**

- Acteurs : Utilisateur
- Design responsive (mobile, tablette, desktop)
- Navigation fluide et intuitive
- Thème adapté à l'univers Warhammer
- Optimisation des performances

## Technologies utilisées

### Frontend

- **Vue.js 3** - Framework progressif JavaScript
- **TypeScript** - Typage statique pour JavaScript
- **Vuetify 3** - Framework UI Material Design
- **Pinia** - Gestionnaire d'état moderne pour Vue
- **Vue Router** - Routage officiel pour Vue.js

### Build & Dev Tools

- **Vite** - Build tool rapide et moderne
- **ESLint** - Linter pour maintenir la qualité du code
- **vue-tsc** - Type checking pour Vue + TypeScript

### Authentification

- **Keycloak** - Solution d'authentification et d'autorisation

### Styling

- **Material Design Icons** - Iconographie cohérente
- **CSS3** - Styles personnalisés et animations

## Installation

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/ryannnasa/old-world-builder-front.git
   cd old-world-builder-front
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer l'environnement**

   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible sur `http://localhost:5173`

## Utilisation

### Développement

```bash
# Démarrer en mode développement avec hot-reload
npm run dev

# Vérification des types TypeScript
npm run type-check

# Linting du code
npm run lint
```

### Production

```bash
# Build pour la production
npm run build

# Preview du build de production
npm run preview
```

## Structure du projet

```
old-world-realms/
├── public/                     # Assets statiques
│   ├── img/                   # Images et logos
│   │   ├── armees/           # Images des armées
│   │   └── background*.webp   # Images de fond
│   └── favicon.ico
├── src/
│   ├── assets/               # Assets compilés
│   ├── components/           # Composants Vue réutilisables
│   │   ├── BattleReportCards.vue
│   │   ├── BattleReportFilters.vue
│   │   ├── Footer.vue
│   │   └── Navbar.vue
│   ├── router/              # Configuration du routage
│   │   └── index.ts
│   ├── stores/              # Stores Pinia (état global)
│   │   ├── auth.ts          # Authentification
│   │   ├── battleReport.ts  # Rapports de bataille
│   │   ├── army.ts          # Données des armées
│   │   └── ...
│   ├── views/               # Pages de l'application
│   │   ├── HomePage.vue
│   │   ├── AllBattleReports.vue
│   │   ├── CreateABattleReport.vue
│   │   └── ...
│   ├── App.vue              # Composant racine
│   ├── main.ts              # Point d'entrée
│   └── keycloak-config.ts   # Configuration Keycloak
├── Model/                   # Modèles de données et exports
├── package.json
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
└── README.md
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# API Backend
VITE_API_BASE_URL=http://localhost:8080

# Keycloak Configuration
VITE_KEYCLOAK_URL=https://your-keycloak-server
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
```

### Configuration Keycloak

Modifiez `src/keycloak-config.ts` selon votre configuration :

```typescript
export default {
  url: "https://your-keycloak-server",
  realm: "your-realm",
  clientId: "your-client-id",
};
```

## Déploiement

### Pipeline CI/CD (GitHub Actions)

Le projet utilise un pipeline automatisé GitHub Actions pour le déploiement en production. Le pipeline se déclenche automatiquement lors de la création d'une release et comprend 4 étapes principales :

#### 1. Build (Construction)
```yaml
- Checkout du code source
- Configuration du user Git pour les commits automatiques
- Bump automatique de la version (selon le tag de release)
- Construction de l'image Docker sans push
```

#### 2. Test (Tests automatisés)
```yaml
- Installation des dépendances npm
- Exécution de la suite de tests
- Validation de la qualité du code
```

#### 3. Push (Publication)
```yaml
- Authentification sur Docker Hub
- Publication de l'image Docker avec le tag de version
- Image disponible : maximerobin44/old-world-realms-front:VERSION
```

#### 4. Deploy (Déploiement Kubernetes)
```yaml
- Configuration de kubeconfig via secrets
- Injection des variables d'environnement dans deployment.yaml
- Déploiement sur cluster Kubernetes
```

### Configuration des secrets GitHub

Pour que le pipeline fonctionne, configurez ces secrets dans votre repository :

```bash
DOCKERHUB_USERNAME    # Nom d'utilisateur Docker Hub
DOCKERHUB_TOKEN       # Token d'accès Docker Hub
KUBE_CONFIG          # Configuration Kubernetes (base64)
```

### Infrastructure Kubernetes

Le déploiement utilise les manifests Kubernetes situés dans `/k8s/` :

- **deployment.yaml** : Configuration du pod avec limites de ressources
- **service.yaml** : Exposition du service
- **ingress.yaml** : Configuration du routage externe
- **certificate.yaml** : Certificats SSL/TLS

#### Ressources allouées
```yaml
Resources:
  Requests: 128Mi RAM / 100m CPU
  Limits: 256Mi RAM / 200m CPU
Replicas: 1 (configurable selon la charge)
```

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Déploiement manuel

#### Option 1: Déploiement Docker local

```bash
# Build de l'image
docker build -t old-world-realms-front .

# Exécution du container
docker run -p 80:80 old-world-realms-front
```

#### Option 2: Déploiement sur serveur web classique

1. Uploadez le contenu du dossier `dist/` sur votre serveur
2. Configurez votre serveur web pour servir `index.html` pour toutes les routes
3. Assurez-vous que les variables d'environnement de production sont correctes

#### Option 3: Déploiement Kubernetes manuel

```bash
# Application des manifests Kubernetes
kubectl apply -f k8s/

# Vérification du déploiement
kubectl get pods -l app=old-world-realms-front
kubectl get services old-world-realms-front
```

### Monitoring et logs

#### Accès aux logs du container

```bash
# Logs en temps réel
kubectl logs -f deployment/old-world-realms-front

# Logs Docker local
docker logs -f container_name
```

#### Vérification de l'état du déploiement

```bash
# Status des pods
kubectl get pods

# Détails du déploiement
kubectl describe deployment old-world-realms-front

# Vérification des ressources
kubectl top pods
```

## Documentation technique

### Architecture et patterns employés

#### 1. Composition API et Pinia Store Pattern

L'application utilise la Composition API de Vue 3 avec Pinia pour la gestion d'état. Voici l'exemple du store d'authentification :

```typescript
// stores/auth.ts - Pattern de store réactif avec TypeScript
import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'

export type Profile = {
  email: string
  emailVerified: boolean
  firstName: string
  id: string
  lastName: string
  username: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    keycloak: null as Keycloak | null,
    authenticated: false,
    profile: null as Profile | null,
  }),
  actions: {
    init() {
      this.keycloak = new Keycloak(keycloakConfig)
      
      return this.keycloak.init({ 
        onLoad: 'login-required',
        redirectUri: window.location.origin + '/homepage'
      })
    }
  }
})
```

**Avantages de cette approche :**
- **Type Safety** : TypeScript garantit la cohérence des types
- **Réactivité** : Mise à jour automatique des composants
- **Séparation des responsabilités** : Logic métier isolée dans les stores

#### 2. Architecture en couches et API centralisée

```typescript
// utils/api.ts - Configuration centralisée des endpoints
export const api = 'https://api.oldworldrealms.app/'

// stores/battleReport.ts - Couche de données avec types stricts
type BattleReport = {
  idBattleReport?: number
  nameBattleReport?: string
  descriptionBattleReport?: string
  battleReportPhotos?: BattleReportPhoto[]
  scenario_idScenario?: number
  players?: Player[]
  armyPoints?: number
  idUser?: string
}

export const useBattleReportStore = defineStore('battleReport', {
  state: () => ({
    battleReports: [] as BattleReport[],
    battleReport: null as BattleReport | null,
  }),
  actions: {
    getBattleReport() {
      return fetch(`${api}battlereport`)
        .then(response => response.json())
        .then(data => this.battleReports = data)
    }
  }
})
```

#### 3. Routing avec gardes d'authentification

```typescript
// router/index.ts - Configuration des routes avec protection
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/createabattlereport',
    name: 'Create A New Battle Report',
    component: CreateABattleReport,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de navigation pour l'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.authenticated) {
    next('/login')
  } else {
    next()
  }
})
```

#### 4. Composants intelligents avec filtrage réactif

```vue
<!-- components/BattleReportFilters.vue -->
<template>
  <v-card class="mb-4 card-container">
    <v-card-title class="filter-title" @click="toggleFilters">
      Filtres
      <v-btn icon @click.stop="toggleFilters">
        <v-icon>{{ showFilters ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-card-text v-show="showFilters || !isMobile">
      <v-row>
        <v-col cols="12" md="3">
          <v-select 
            v-model="localSelectedFaction" 
            :items="factions" 
            label="Armée jouée" 
            @update:model-value="updateFaction"
          />
        </v-col>
        <!-- Autres filtres... -->
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Logique de filtrage réactive avec émission d'événements
const emit = defineEmits(['update:faction', 'update:opponent'])
const props = defineProps<{
  selectedFaction: string
  selectedOpponent: string
}>()

const updateFaction = (value: string) => {
  emit('update:faction', value)
}
</script>
```

### Bonnes pratiques techniques

#### 1. Configuration Vuetify avec thème personnalisé

```typescript
// main.ts - Configuration modulaire et extensible
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#1867C0',
    secondary: '#48A9A6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: { myCustomLightTheme }
  }
})
```

#### 2. Build configuration optimisée

```typescript
// vite.config.ts - Configuration performance et développement
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // Outils de débogage en développement
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Path mapping
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vuetify'], // Séparation des chunks pour le cache
          auth: ['keycloak-js']
        }
      }
    }
  }
})
```

### Sécurité et authentification

#### 1. Intégration Keycloak

```typescript
// keycloak-config.ts - Configuration sécurisée
export default {
  url: process.env.VITE_KEYCLOAK_URL,
  realm: process.env.VITE_KEYCLOAK_REALM,
  clientId: process.env.VITE_KEYCLOAK_CLIENT_ID,
}

// Initialisation avec gestion d'erreurs
const authStore = useAuthStore()
authStore.init()
  .then(authenticated => {
    if (authenticated) {
      console.log('Utilisateur authentifié')
    }
  })
  .catch(error => {
    console.error('Erreur d\'authentification:', error)
  })
```

#### 2. Protection des routes et données

```typescript
// Middleware de protection avec redirection automatique
const requireAuth = (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  if (!authStore.authenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
}
```

### Performance et optimisation

#### 1. Lazy loading des composants

```typescript
// Chargement à la demande pour réduire le bundle initial
const LazyComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)
```

#### 2. Docker multi-stage pour optimisation

```dockerfile
# Stage 1: Build optimisé
FROM node:21-alpine AS build
COPY package.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Runtime léger
FROM nginx:alpine
COPY --from=build dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
```

### Patterns de développement

#### 1. Composables pour la logique réutilisable

```typescript
// composables/useFilters.ts - Logic réutilisable
export function useFilters() {
  const filters = ref({
    faction: '',
    opponent: '',
    scenario: '',
    points: null
  })
  
  const applyFilters = (data: BattleReport[]) => {
    return data.filter(report => {
      if (filters.value.faction && !report.players?.some(p => p.faction === filters.value.faction)) {
        return false
      }
      // Autres filtres...
      return true
    })
  }
  
  return { filters, applyFilters }
}
```

#### 2. Error boundary et gestion d'erreurs

```typescript
// Gestion centralisée des erreurs
const handleApiError = (error: Error, context: string) => {
  console.error(`Erreur ${context}:`, error)
  
  // Log vers service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // trackError(error, context)
  }
  
  // Notification utilisateur
  toast.error(`Une erreur est survenue: ${context}`)
}
```

### Tests et qualité

#### 1. Structure de tests

```typescript
// tests/components/BattleReportCard.spec.ts
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import BattleReportCard from '@/components/BattleReportCard.vue'

describe('BattleReportCard', () => {
  const vuetify = createVuetify()
  
  const mockBattleReport = {
    idBattleReport: 1,
    nameBattleReport: 'Test Battle',
    players: [
      { name: 'Player 1', faction: 'Empire' }
    ]
  }
  
  it('displays battle report information correctly', () => {
    const wrapper = mount(BattleReportCard, {
      props: { battleReport: mockBattleReport },
      global: { plugins: [vuetify] }
    })
    
    expect(wrapper.text()).toContain('Test Battle')
    expect(wrapper.text()).toContain('Player 1')
  })
})
```

Cette architecture garantit une **maintenabilité élevée**, une **performance optimisée** et une **expérience développeur fluide** grâce aux patterns modernes de Vue 3 et TypeScript.

### Exemple de configuration Nginx

```nginx
server {
    listen 80;
    server_name oldworldrealms.com;
    root /var/www/old-world-realms;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-server:8080/;
    }
}
```

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. **Commit** vos modifications (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une **Pull Request**

### Guidelines de développement

- Respectez les conventions de nommage TypeScript
- Ajoutez des tests pour les nouvelles fonctionnalités
- Documentez les nouvelles APIs
- Utilisez les composants Vuetify existants quand possible
- Optimisez les performances (lazy loading, etc.)

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les [issues existantes](https://github.com/ryannnasa/old-world-builder-front/issues)
2. Créez une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Environnement (OS, navigateur, version Node.js)
   - Screenshots si applicable

## Licence

Ce projet est sous licence [MIT](LICENSE).

---

**Développé pour la communauté Warhammer: The Old World**

[Site web](https://oldworldrealms.com) • [Signaler un bug](https://github.com/ryannnasa/old-world-builder-front/issues) • [Discussions](https://github.com/ryannnasa/old-world-builder-front/discussions)
