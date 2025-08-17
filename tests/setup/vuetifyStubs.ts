import { config } from '@vue/test-utils';

// Configuration globale des stubs Vuetify pour les tests
export const vuetifyStubs = {
  // Container et layout
  'v-app': { template: '<div class="v-app"><slot /></div>' },
  'v-main': { template: '<main class="v-main"><slot /></main>' },
  'v-container': { template: '<div class="v-container"><slot /></div>' },
  'v-row': { template: '<div class="row"><slot /></div>' },
  'v-col': { template: '<div class="col"><slot /></div>' },
  
  // Cards et surfaces
  'v-card': { template: '<div class="v-card"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },
  'v-card-actions': { template: '<div class="v-card-actions"><slot /></div>' },
  'v-sheet': { template: '<div class="v-sheet"><slot /></div>' },
  
  // Boutons
  'v-btn': { 
    template: '<button class="v-btn" @click="$emit(\'click\')"><slot /></button>',
    emits: ['click']
  },
  'v-fab': { 
    template: '<button class="v-fab" @click="$emit(\'click\')"><slot /></button>',
    emits: ['click']
  },
  
  // Formulaires
  'v-form': { 
    template: '<form class="v-form" @submit="$emit(\'submit\')"><slot /></form>',
    emits: ['submit']
  },
  'v-text-field': { 
    template: '<input class="v-text-field" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'label', 'readonly', 'rules', 'type'],
    emits: ['update:modelValue']
  },
  'v-textarea': { 
    template: '<textarea class="v-textarea" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['modelValue', 'label', 'readonly', 'rules'],
    emits: ['update:modelValue']
  },
  'v-select': { 
    template: '<select class="v-select" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
    props: ['modelValue', 'items', 'label', 'readonly'],
    emits: ['update:modelValue']
  },
  'v-checkbox': { 
    template: '<input type="checkbox" class="v-checkbox" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  
  // Navigation
  'v-navigation-drawer': { template: '<nav class="v-navigation-drawer"><slot /></nav>' },
  'v-app-bar': { template: '<header class="v-app-bar"><slot /></header>' },
  'v-app-bar-nav-icon': { 
    template: '<button class="v-app-bar-nav-icon" @click="$emit(\'click\')"></button>',
    emits: ['click']
  },
  'v-app-bar-title': { template: '<div class="v-app-bar-title"><slot /></div>' },
  'v-spacer': { template: '<div class="v-spacer"></div>' },
  
  // Carrousel
  'v-carousel': { template: '<div class="v-carousel"><slot /></div>' },
  'v-carousel-item': { template: '<div class="v-carousel-item"><slot /></div>' },
  
  // Dialogues et overlays
  'v-dialog': { 
    template: '<div class="v-dialog" v-if="modelValue"><slot /></div>',
    props: ['modelValue'],
    emits: ['update:modelValue']
  },
  'v-overlay': { template: '<div class="v-overlay"><slot /></div>' },
  'v-snackbar': { 
    template: '<div class="v-snackbar" v-if="modelValue"><slot /></div>',
    props: ['modelValue', 'color', 'timeout'],
    emits: ['update:modelValue']
  },
  
  // Listes et items
  'v-list': { template: '<ul class="v-list"><slot /></ul>' },
  'v-list-item': { template: '<li class="v-list-item"><slot /></li>' },
  'v-list-item-title': { template: '<div class="v-list-item-title"><slot /></div>' },
  'v-list-item-subtitle': { template: '<div class="v-list-item-subtitle"><slot /></div>' },
  
  // Icônes
  'v-icon': { 
    template: '<i class="v-icon">{{ icon }}</i>',
    props: ['icon']
  },
  
  // Dividers
  'v-divider': { template: '<hr class="v-divider" />' },
  
  // Chips et badges
  'v-chip': { template: '<span class="v-chip"><slot /></span>' },
  'v-badge': { template: '<span class="v-badge"><slot /></span>' },
  
  // Progress
  'v-progress-circular': { template: '<div class="v-progress-circular"></div>' },
  'v-progress-linear': { template: '<div class="v-progress-linear"></div>' },
  
  // Menu
  'v-menu': { template: '<div class="v-menu"><slot /></div>' },
  
  // Expansion panels
  'v-expansion-panels': { template: '<div class="v-expansion-panels"><slot /></div>' },
  'v-expansion-panel': { template: '<div class="v-expansion-panel"><slot /></div>' },
  'v-expansion-panel-title': { template: '<div class="v-expansion-panel-title"><slot /></div>' },
  'v-expansion-panel-text': { template: '<div class="v-expansion-panel-text"><slot /></div>' },
  
  // Tabs
  'v-tabs': { template: '<div class="v-tabs"><slot /></div>' },
  'v-tab': { template: '<button class="v-tab"><slot /></button>' },
  'v-tab-item': { template: '<div class="v-tab-item"><slot /></div>' },
  
  // Data tables
  'v-data-table': { template: '<table class="v-data-table"><slot /></table>' },
  'v-data-table-server': { template: '<table class="v-data-table-server"><slot /></table>' },
  
  // Images
  'v-img': { 
    template: '<img class="v-img" :src="src" :alt="alt" />',
    props: ['src', 'alt', 'width', 'height']
  },
  
  // Tooltips
  'v-tooltip': { template: '<div class="v-tooltip"><slot /></div>' }
};

// Configuration globale pour Vue Test Utils
config.global.stubs = {
  ...config.global.stubs,
  ...vuetifyStubs
};

export default vuetifyStubs;
