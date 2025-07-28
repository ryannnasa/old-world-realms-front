import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'
import keycloakConfig from '../keycloak-config'

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
    async init() {
      this.keycloak = new Keycloak(keycloakConfig)
      const authenticated = await this.keycloak.init({ onLoad: 'login-required' })
      this.authenticated = authenticated

      if (authenticated) {
        const keycloakProfile = await this.keycloak.loadUserProfile()
        this.profile = {
          email: keycloakProfile.email ?? '',
          emailVerified: false,  // adapter si tu as l'info
          firstName: keycloakProfile.firstName ?? '',
          id: keycloakProfile.id ?? '',
          lastName: keycloakProfile.lastName ?? '',
          username: keycloakProfile.username ?? '',
        }
      } else {
        this.profile = null
      }
    },
    login() {
      this.keycloak?.login()
    },
    logout() {
      this.keycloak?.logout()
    }
  },
  getters: {
    isLoggedIn: (state) => state.authenticated && !!state.profile,
  }
})
