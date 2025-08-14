# 🏰 Old World Realms

<div align="center">
  <img src="public/img/Logo Old World Realms.png" alt="Old World Realms Logo" width="200"/>
  
  **Une encyclopédie interactive dédiée à Warhammer: The Old World**
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Configuration](#-configuration)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Support](#-support)
- [Licence](#-licence)

## 🎯 À propos

Old World Realms est une application web moderne dédiée aux passionnés de Warhammer: The Old World. Cette plateforme interactive permet aux joueurs de :

- Consulter les règles des différentes armées
- Créer et partager des rapports de bataille illustrés
- Explorer les scénarios officiels
- Suivre leurs campagnes et progressions
- Interagir avec la communauté

## ✨ Fonctionnalités

### 🏛️ **Encyclopédie interactive**

- Base de données complète des armées et unités
- Règles détaillées et descriptions
- Photos haute qualité des figurines

### ⚔️ **Rapports de bataille**

- Création de rapports détaillés avec photos
- Système de score et résultats
- Filtrage par faction, scénario, points
- Mode grille et carrousel pour la visualisation

### 🎲 **Gestion des scénarios**

- Catalogue des scénarios officiels
- Système de points personnalisable
- Support des alliances multiples

### 👤 **Gestion utilisateur**

- Authentification sécurisée avec Keycloak
- Profils personnalisables
- Historique des parties

### 📱 **Design responsive**

- Interface optimisée mobile et desktop
- Thème sombre personnalisé
- Navigation intuitive

## 🛠️ Technologies utilisées

### **Frontend**

- **Vue.js 3** - Framework progressif JavaScript
- **TypeScript** - Typage statique pour JavaScript
- **Vuetify 3** - Framework UI Material Design
- **Pinia** - Gestionnaire d'état moderne pour Vue
- **Vue Router** - Routage officiel pour Vue.js

### **Build & Dev Tools**

- **Vite** - Build tool rapide et moderne
- **ESLint** - Linter pour maintenir la qualité du code
- **vue-tsc** - Type checking pour Vue + TypeScript

### **Authentification**

- **Keycloak** - Solution d'authentification et d'autorisation

### **Styling**

- **Material Design Icons** - Iconographie cohérente
- **CSS3** - Styles personnalisés et animations

## 🚀 Installation

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

## 🎮 Utilisation

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

## 📁 Structure du projet

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

## ⚙️ Configuration

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

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Déploiement sur serveur web

1. Uploadez le contenu du dossier `dist/` sur votre serveur
2. Configurez votre serveur web pour servir `index.html` pour toutes les routes
3. Assurez-vous que les variables d'environnement de production sont correctes

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

## 🤝 Contribution

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

## 🐛 Support

Si vous rencontrez des problèmes :

1. Vérifiez les [issues existantes](https://github.com/ryannnasa/old-world-builder-front/issues)
2. Créez une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Environnement (OS, navigateur, version Node.js)
   - Screenshots si applicable

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

<div align="center">
  <p>Fait avec ❤️ pour la communauté Warhammer: The Old World</p>
  <p>
    <a href="https://oldworldrealms.com">Site web</a> •
    <a href="https://github.com/ryannnasa/old-world-builder-front/issues">Signaler un bug</a> •
    <a href="https://github.com/ryannnasa/old-world-builder-front/discussions">Discussions</a>
  </p>
</div>
