// jest.setup.ts
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Silence styled-jsx warning about boolean `jsx` attribute in test environment
const _consoleError = console.error;
console.error = (...args: any[]) => {
  try {
    const joined = args.map((a) => String(a)).join(" ");
    if (/non-boolean attribute `jsx`/.test(joined)) return;
  } catch (e) {
    // ignore
  }
};
