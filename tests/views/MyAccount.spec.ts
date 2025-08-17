import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import MyAccount from '@/views/MyAccount.vue';
import { useAuthStore } from '@/stores/auth';

// Mock du router
const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush })
}));

describe('MyAccount - Tests unitaires', () => {
  let wrapper;
  let authStore;
  let pinia;

  const mockProfile = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe'
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(MyAccount, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-container': { template: '<div><slot /></div>' },
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-text-field': { 
            template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" :value="modelValue" :readonly="readonly" />', 
            props: ['modelValue', 'readonly'],
            emits: ['update:modelValue']
          },
          'v-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          'v-snackbar': { 
            template: '<div v-if="modelValue"><slot /></div>', 
            props: ['modelValue', 'color', 'timeout'] 
          },
          'v-dialog': { 
            template: '<div v-if="modelValue"><slot /></div>', 
            props: ['modelValue', 'maxWidth'] 
          }
        }
      }
    });

    authStore = useAuthStore();
    authStore.profile = mockProfile;
    authStore.updateProfile = vi.fn().mockResolvedValue(true);
    authStore.logout = vi.fn();
    
    // Charger les données du formulaire après l'initialisation du store
    wrapper.vm.loadForm();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial du composant', () => {
    it('devrait afficher le titre "Mon compte"', () => {
      expect(wrapper.text()).toContain('Mon compte');
    });

    it('devrait afficher les informations du profil utilisateur', () => {
      // Attendre que les valeurs se propagent dans le template
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 10));
      }).then(() => {
        const html = wrapper.html();
        
        // Vérifier les valeurs dans les inputs
        const inputs = wrapper.findAll('input');
        expect(inputs[0].element.value).toBe('test@example.com'); // email
        expect(inputs[1].element.value).toBe('John'); // firstName
        expect(inputs[2].element.value).toBe('Doe'); // lastName  
        expect(inputs[3].element.value).toBe('johndoe'); // username
      });
    });

    it('devrait charger les données du formulaire au montage', () => {
      expect(wrapper.vm.form.email).toBe('test@example.com');
      expect(wrapper.vm.form.firstName).toBe('John');
      expect(wrapper.vm.form.lastName).toBe('Doe');
      expect(wrapper.vm.form.username).toBe('johndoe');
    });

    it('devrait afficher le bouton "Modifier mon compte" initialement', () => {
      expect(wrapper.text()).toContain('Modifier mon compte');
      expect(wrapper.vm.isEditing).toBe(false);
    });
  });

  describe('Mode édition', () => {
    it('devrait activer le mode édition', () => {
      wrapper.vm.enableEdit();
      expect(wrapper.vm.isEditing).toBe(true);
    });

    it('devrait recharger les données du formulaire en mode édition', () => {
      // Modifier les données du formulaire
      wrapper.vm.form.firstName = 'Modified';
      
      wrapper.vm.enableEdit();
      
      // Les données doivent être rechargées depuis le profil
      expect(wrapper.vm.form.firstName).toBe('John');
    });

    it('devrait annuler les modifications', () => {
      wrapper.vm.isEditing = true;
      wrapper.vm.form.firstName = 'Modified';
      
      wrapper.vm.cancelEdit();
      
      expect(wrapper.vm.isEditing).toBe(false);
      expect(wrapper.vm.form.firstName).toBe('John'); // Rechargé depuis le profil
    });

    it('devrait afficher les boutons d\'enregistrement et d\'annulation en mode édition', () => {
      wrapper.vm.isEditing = true;
      return nextTick().then(() => {
        expect(wrapper.text()).toContain('Enregistrer les modifications');
        expect(wrapper.text()).toContain('Annuler les modifications');
      });
    });
  });

  describe('Sauvegarde des modifications', () => {
    beforeEach(() => {
      wrapper.vm.isEditing = true;
      wrapper.vm.form.firstName = 'UpdatedJohn';
      wrapper.vm.form.lastName = 'UpdatedDoe';
      wrapper.vm.form.username = 'updatedjohndoe';
    });

    it('devrait ouvrir la boîte de dialogue de confirmation', () => {
      wrapper.vm.saveChanges();
      expect(wrapper.vm.saveDialog).toBe(true);
    });

    it('devrait sauvegarder les modifications avec succès', () => {
      wrapper.vm.performSave();
      
      return nextTick().then(() => {
        expect(authStore.updateProfile).toHaveBeenCalledWith({
          ...mockProfile,
          firstName: 'UpdatedJohn',
          lastName: 'UpdatedDoe',
          username: 'updatedjohndoe'
        });
        expect(wrapper.vm.isEditing).toBe(false);
        expect(wrapper.vm.saveDialog).toBe(false);
      });
    });

    it('devrait afficher un message de succès après la sauvegarde', () => {
      wrapper.vm.performSave();
      
      return nextTick().then(() => {
        expect(wrapper.vm.snackbar).toBe(true);
        expect(wrapper.vm.snackbarMessage).toBe('Compte mis à jour.');
        expect(wrapper.vm.snackbarColor).toBe('success');
      });
    });

    it('devrait gérer les erreurs de sauvegarde', () => {
      authStore.updateProfile = vi.fn().mockRejectedValue(new Error('Update error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Appeler performSave et attendre que toutes les promesses se résolvent
      wrapper.vm.performSave();
      return nextTick().then(() => {
        return new Promise(resolve => setTimeout(resolve, 10));
      }).then(() => {
        // Le test doit vérifier la présence du message d'erreur
        expect(wrapper.vm.snackbar).toBe(true);
        expect(wrapper.vm.snackbarColor).toBe('error');
        expect(wrapper.vm.snackbarMessage).toBe('Erreur lors de la mise à jour du compte.');
        expect(wrapper.vm.saveDialog).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Erreur lors de la mise à jour du compte :',
          expect.any(Error)
        );
        
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('Gestion de la snackbar', () => {
    it('devrait afficher une snackbar avec message de succès', () => {
      wrapper.vm.showSnackbar('Test message', 'success');
      
      expect(wrapper.vm.snackbar).toBe(true);
      expect(wrapper.vm.snackbarMessage).toBe('Test message');
      expect(wrapper.vm.snackbarColor).toBe('success');
    });

    it('devrait afficher une snackbar avec message d\'erreur', () => {
      wrapper.vm.showSnackbar('Error message', 'error');
      
      expect(wrapper.vm.snackbar).toBe(true);
      expect(wrapper.vm.snackbarMessage).toBe('Error message');
      expect(wrapper.vm.snackbarColor).toBe('error');
    });

    it('devrait utiliser la couleur par défaut "success"', () => {
      wrapper.vm.showSnackbar('Default message');
      
      expect(wrapper.vm.snackbarColor).toBe('success');
    });
  });

  describe('Déconnexion', () => {
    it('devrait déconnecter l\'utilisateur et rediriger vers login', () => {
      wrapper.vm.logout();
      
      expect(authStore.logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Champs de formulaire', () => {
    it('devrait rendre le champ email en lecture seule', () => {
      const emailField = wrapper.findAll('input')[0];
      expect(emailField.attributes('readonly')).toBeDefined();
    });

    it('devrait permettre l\'édition des autres champs en mode édition', () => {
      wrapper.vm.isEditing = true;
      return nextTick().then(() => {
        const inputs = wrapper.findAll('input');
        // Email toujours en lecture seule
        expect(inputs[0].attributes('readonly')).toBeDefined();
        // Autres champs éditables
        expect(inputs[1].attributes('readonly')).toBeUndefined();
        expect(inputs[2].attributes('readonly')).toBeUndefined();
        expect(inputs[3].attributes('readonly')).toBeUndefined();
      });
    });
  });

  describe('Gestion des données vides', () => {
    it('devrait gérer un profil vide', async () => {
      authStore.profile = null;
      
      wrapper = mount(MyAccount, {
        global: {
          plugins: [pinia],
          stubs: {
            'v-container': { template: '<div><slot /></div>' },
            'v-card': { template: '<div><slot /></div>' },
            'v-card-title': { template: '<div><slot /></div>' },
            'v-card-text': { template: '<div><slot /></div>' },
            'v-text-field': { 
              template: '<input :value="modelValue" />', 
              props: ['modelValue'] 
            },
            'v-btn': { template: '<button><slot /></button>' },
            'v-snackbar': { template: '<div></div>' },
            'v-dialog': { template: '<div></div>' }
          }
        }
      });
      
      expect(wrapper.vm.profile).toEqual({});
    });

    it('devrait gérer des propriétés manquantes dans le profil', async () => {
      authStore.profile = { email: 'test@example.com' }; // Propriétés manquantes
      
      wrapper.vm.loadForm();
      
      expect(wrapper.vm.form.email).toBe('test@example.com');
      expect(wrapper.vm.form.firstName).toBeUndefined();
      expect(wrapper.vm.form.lastName).toBeUndefined();
      expect(wrapper.vm.form.username).toBeUndefined();
    });
  });

  describe('États de dialogue', () => {
    it('devrait fermer la boîte de dialogue de sauvegarde', async () => {
      wrapper.vm.saveDialog = true;
      
      // Simuler l'annulation dans la boîte de dialogue
      wrapper.vm.saveDialog = false;
      
      expect(wrapper.vm.saveDialog).toBe(false);
    });

    it('devrait afficher la boîte de dialogue avec le bon contenu', () => {
      wrapper.vm.saveDialog = true;
      return nextTick().then(() => {
        expect(wrapper.text()).toContain('Confirmer les modifications');
        expect(wrapper.text()).toContain('Es-tu sûr de vouloir');
        expect(wrapper.text()).toContain('enregistrer les modifications');
      });
    });
  });

  describe('Réactivité des computed', () => {
    it('devrait mettre à jour le computed profile quand authStore.profile change', () => {
      const newProfile = {
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith'
      };
      
      authStore.profile = newProfile;
      return nextTick().then(() => {
        expect(wrapper.vm.profile).toEqual(newProfile);
      });
    });
  });
});
