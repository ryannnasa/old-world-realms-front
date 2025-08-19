/**
 * 🔒 Configuration Content Security Policy pour Old World Realms
 * Protège contre XSS, injection de code, et autres attaques client
 */

export const cspConfig = {
  // Directive par défaut - appliquée si pas de directive spécifique
  'default-src': ["'self'"],
  
  // Scripts autorisés
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Vue.js en dev mode
    "'unsafe-eval'",   // Vite HMR en dev
    "https://unpkg.com", // CDN Vuetify
    "https://cdn.jsdelivr.net", // CDN
  ],
  
  // Styles autorisés
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Vuetify styles inline
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
  ],
  
  // Polices autorisées
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "data:", // Icônes MDI en base64
  ],
  
  // Images autorisées
  'img-src': [
    "'self'",
    "data:", // Images base64
    "blob:", // Upload d'images
    "https:", // Images externes (armées, etc.)
  ],
  
  // Connexions autorisées (API, WebSocket)
  'connect-src': [
    "'self'",
    "https://api.old-world-realms.com", // Votre API
    "https://auth.old-world-realms.com", // Keycloak
    "ws://localhost:*", // Vite HMR en dev
    "wss://localhost:*", // Vite HMR en dev
  ],
  
  // Frames autorisées
  'frame-src': [
    "'self'",
    "https://auth.old-world-realms.com", // Keycloak
  ],
  
  // Objets multimédia
  'object-src': ["'none'"],
  
  // Workers
  'worker-src': ["'self'", "blob:"],
  
  // Base URI pour les liens relatifs
  'base-uri': ["'self'"],
  
  // Formulaires
  'form-action': ["'self'"],
  
  // Upgrade insecure requests en HTTPS
  'upgrade-insecure-requests': true,
  
  // Bloque le contenu mixte
  'block-all-mixed-content': true,
};

/**
 * Génère le header CSP pour le serveur
 */
export function generateCSPHeader(isDev = false) {
  const policies = { ...cspConfig };
  
  if (isDev) {
    // Relaxation des règles en développement
    policies['script-src'].push("'unsafe-eval'");
    policies['style-src'].push("'unsafe-inline'");
    policies['connect-src'].push("ws://localhost:*", "http://localhost:*");
  }
  
  return Object.entries(policies)
    .map(([directive, sources]) => {
      if (typeof sources === 'boolean') {
        return sources ? directive : '';
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
}

/**
 * Meta tag CSP pour le HTML
 */
export function generateCSPMetaTag(isDev = false) {
  return `<meta http-equiv="Content-Security-Policy" content="${generateCSPHeader(isDev)}">`;
}
