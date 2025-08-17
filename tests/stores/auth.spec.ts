import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useAuthStore } from '../../src/stores/auth';

const mockKeycloak = {
  init: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  loadUserProfile: vi.fn(),
};

vi.mock('keycloak-js', () => {
  return {
    default: vi.fn(() => mockKeycloak)
  };
});

vi.mock('../../src/keycloak-config', () => ({
  default: {
    url: 'http://localhost:8080/auth',
    realm: 'test',
    clientId: 'test-client'
  }
}));

describe('Auth Store - Tests unitaires', () => {
  let store: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuthStore();
    vi.clearAllMocks();
    
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true
    });
  });

  describe('État initial du store', () => {
    it('devrait initialiser avec des valeurs par défaut', () => {
      expect(store.keycloak).toBeNull();
      expect(store.authenticated).toBe(false);
      expect(store.profile).toBeNull();
      expect(store.isLoggedIn).toBe(false);
    });
  });

  describe('init', () => {
    it('devrait initialiser Keycloak avec succès et charger le profil', () => {
      const mockProfile = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        id: '123'
      };

      mockKeycloak.init.mockResolvedValue(true);
      mockKeycloak.loadUserProfile.mockResolvedValue(mockProfile);

      return store.init().then(() => {
        expect(mockKeycloak.init).toHaveBeenCalledWith({
          onLoad: 'login-required',
          redirectUri: 'http://localhost:3000/homepage'
        });
        expect(store.authenticated).toBe(true);
        expect(store.profile).toEqual({
          email: 'test@example.com',
          emailVerified: false,
          firstName: 'John',
          id: '123',
          lastName: 'Doe',
          username: 'johndoe'
        });
        expect(store.isLoggedIn).toBe(true);
      });
    });

    it('devrait gérer l\'échec d\'authentification', () => {
      mockKeycloak.init.mockResolvedValue(false);

      return store.init().then(() => {
        expect(store.authenticated).toBe(false);
        expect(store.profile).toBeNull();
        expect(store.isLoggedIn).toBe(false);
      });
    });

    it('devrait gérer les erreurs d\'initialisation', () => {
      mockKeycloak.init.mockRejectedValue(new Error('Init failed'));

      return store.init().catch(() => {
        expect(store.authenticated).toBe(false);
        expect(store.profile).toBeNull();
      });
    });

    it('devrait gérer les profils avec des valeurs manquantes', () => {
      const incompleteProfile = {
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        username: undefined,
        id: undefined
      };

      mockKeycloak.init.mockResolvedValue(true);
      mockKeycloak.loadUserProfile.mockResolvedValue(incompleteProfile);

      return store.init().then(() => {
        expect(store.profile).toEqual({
          email: '',
          emailVerified: false,
          firstName: '',
          id: '',
          lastName: '',
          username: ''
        });
      });
    });
  });

  describe('login', () => {
    it('devrait appeler la méthode login de Keycloak', () => {
      store.keycloak = mockKeycloak as any;
      
      store.login();
      
      expect(mockKeycloak.login).toHaveBeenCalledWith({
        redirectUri: 'http://localhost:3000/homepage'
      });
    });

    it('ne devrait rien faire si Keycloak n\'est pas initialisé', () => {
      store.keycloak = null;
      
      store.login();
      
      expect(mockKeycloak.login).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('devrait appeler la méthode logout de Keycloak', () => {
      store.keycloak = mockKeycloak as any;
      
      store.logout();
      
      expect(mockKeycloak.logout).toHaveBeenCalled();
    });

    it('ne devrait rien faire si Keycloak n\'est pas initialisé', () => {
      store.keycloak = null;
      
      store.logout();
      
      expect(mockKeycloak.logout).not.toHaveBeenCalled();
    });
  });

  describe('isLoggedIn getter', () => {
    it('devrait retourner true quand authentifié avec profil', () => {
      store.authenticated = true;
      store.profile = {
        email: 'test@example.com',
        emailVerified: false,
        firstName: 'John',
        id: '123',
        lastName: 'Doe',
        username: 'johndoe'
      };
      
      expect(store.isLoggedIn).toBe(true);
    });

    it('devrait retourner false quand authentifié sans profil', () => {
      store.authenticated = true;
      store.profile = null;
      
      expect(store.isLoggedIn).toBe(false);
    });

    it('devrait retourner false quand non authentifié', () => {
      store.authenticated = false;
      store.profile = {
        email: 'test@example.com',
        emailVerified: false,
        firstName: 'John',
        id: '123',
        lastName: 'Doe',
        username: 'johndoe'
      };
      
      expect(store.isLoggedIn).toBe(false);
    });
  });
});
