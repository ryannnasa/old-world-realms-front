// Mock global de fetch pour tous les tests (évite les erreurs réseau en CI)
if (!global.fetch) {
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      status: 200
    })
  );
}
import { vi } from 'vitest';
import './vuetifyStubs';

// Mock global de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock global de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de console.warn pour réduire le bruit dans les tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Ignorer les warnings spécifiques de Vue/Vuetify
  const message = args[0];
  if (typeof message === 'string') {
    if (
      message.includes('Failed to resolve component') ||
      message.includes('v-card-actions') ||
      message.includes('If this is a native custom element')
    ) {
      return;
    }
  }
  originalWarn(...args);
};

// Mock de console.error pour capturer les erreurs sans les afficher
const originalError = console.error;
console.error = (...args: any[]) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Ignorer certaines erreurs de test courantes
    if (message.includes('Cannot read properties of undefined')) {
      return;
    }
  }
  originalError(...args);
};
