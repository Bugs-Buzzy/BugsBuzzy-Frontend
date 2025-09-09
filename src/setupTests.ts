import '@testing-library/jest-dom';

// Provide build-time constant fallbacks for Vitest environment
(globalThis as any).__APP_VERSION__ = (globalThis as any).__APP_VERSION__ || 'test-version';
(globalThis as any).__BUILD_DATE__ = (globalThis as any).__BUILD_DATE__ || new Date().toISOString();
(globalThis as any).__APP_ENV__ = (globalThis as any).__APP_ENV__ || 'test';
