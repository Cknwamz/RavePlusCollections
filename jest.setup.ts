import '@testing-library/jest-dom';

// Mock matchMedia for framer-motion and responsible design hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for framer-motion whileInView
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

jest.mock('framer-motion', () => {
  const React = require('react');
  
  // Custom mock for motion components to just render their intrinsic HTML elements
  const customMotion = new Proxy({}, {
    get: (_, prop) => {
      return React.forwardRef((props: any, ref: any) => {
        const {
          initial, animate, exit, variants, transition, whileHover, whileTap, whileInView, viewport, layoutId,
          ...validProps
        } = props;
        return React.createElement(prop as string, { ...validProps, ref });
      });
    }
  });

  return {
    motion: customMotion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});
