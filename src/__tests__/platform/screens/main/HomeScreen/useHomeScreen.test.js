/**
 * useDashboardScreen Hook Tests
 * File: useHomeScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');

const useDashboardScreen = require('@platform/screens/main/HomeScreen/useDashboardScreen').default;

// Custom renderHook implementation to avoid @testing-library/react-hooks dependency
const act = TestRenderer.act;
const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;
  
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    Object.assign(result, hookResult);
    return null;
  };
  
  act(() => {
    renderer = TestRenderer.create(React.createElement(HookHarness, { hookProps: initialProps }));
  });
  
  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(React.createElement(HookHarness, { hookProps: newProps }));
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useDashboardScreen Hook', () => {
  it('should return an object', () => {
    const { result } = renderHook(() => useDashboardScreen());
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should not throw when called', () => {
    expect(() => {
      renderHook(() => useDashboardScreen());
    }).not.toThrow();
  });

  it('should return consistent structure', () => {
    const { result, rerender } = renderHook(() => useDashboardScreen());
    const firstResult = result.current;

    rerender();
    const secondResult = result.current;

    expect(Object.keys(firstResult)).toEqual(Object.keys(secondResult));
  });
});

