/**
 * 🔒 Configuration des Headers de Sécurité pour Old World Realms
 */

export const securityHeaders = {
  // Strict Transport Security - Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Empêche le MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Protection XSS intégrée au navigateur
  'X-XSS-Protection': '1; mode=block',
  
  // Contrôle d'embedding en iframe
  'X-Frame-Options': 'DENY',
  
  // Contrôle du referrer
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (anciennement Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '),
  
  // Retire les headers révélant des infos serveur
  'Server': '',
  'X-Powered-By': '',
};

/**
 * Configuration Vite pour les headers de sécurité
 */
export const viteSecurityConfig = {
  server: {
    headers: securityHeaders,
    https: false, // Activer en production
  },
  preview: {
    headers: securityHeaders,
    https: false, // Activer en production
  },
};

/**
 * Middleware Express pour les headers de sécurité
 */
export function securityMiddleware(req: any, res: any, next: any) {
  // Application des headers de sécurité
  Object.entries(securityHeaders).forEach(([header, value]) => {
    if (value) {
      res.setHeader(header, value);
    }
  });
  
  // CSP dynamique selon l'environnement
  const isDev = process.env.NODE_ENV === 'development';
  const csp = generateCSPHeader(isDev);
  res.setHeader('Content-Security-Policy', csp);
  
  next();
}

/**
 * Configuration de sécurité pour le build Vite
 */
export const buildSecurityConfig = {
  rollupOptions: {
    output: {
      // Sécurisation des noms de chunks
      chunkFileNames: 'assets/[name]-[hash].js',
      entryFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
  },
  // Minification agressive
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true, // Supprime les console.log en prod
      drop_debugger: true, // Supprime les debugger
    },
  },
};
