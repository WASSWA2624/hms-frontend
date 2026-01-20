/**
 * useLandingScreen Hook Tests
 * File: useLandingScreen.test.js
 */
const React = require('react');
const TestRenderer = require('react-test-renderer');
const { useRouter } = require('expo-router');

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

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const useLandingScreen = require('@platform/screens/common/LandingScreen/useLandingScreen').default;

describe('useLandingScreen Hook', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue(mockRouter);
  });

  it('should return handleGetStarted function', () => {
    const { result } = renderHook(() => useLandingScreen());
    expect(result.current.handleGetStarted).toBeDefined();
    expect(typeof result.current.handleGetStarted).toBe('function');
  });

  it('should return handleLearnMore function', () => {
    const { result } = renderHook(() => useLandingScreen());
    expect(result.current.handleLearnMore).toBeDefined();
    expect(typeof result.current.handleLearnMore).toBe('function');
  });

  it('should navigate to /home when handleGetStarted is called', () => {
    const { result } = renderHook(() => useLandingScreen());
    
    act(() => {
      result.current.handleGetStarted();
    });

    expect(mockPush).toHaveBeenCalledWith('/home');
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should not throw when handleLearnMore is called', () => {
    const { result } = renderHook(() => useLandingScreen());
    
    expect(() => {
      act(() => {
        result.current.handleLearnMore();
      });
    }).not.toThrow();
  });

  it('should memoize handleGetStarted callback', () => {
    const { result, rerender } = renderHook(() => useLandingScreen());
    const firstCallback = result.current.handleGetStarted;
    
    rerender();
    const secondCallback = result.current.handleGetStarted;
    
    // Callbacks should be the same reference (memoized)
    expect(firstCallback).toBe(secondCallback);
  });

  it('should memoize handleLearnMore callback', () => {
    const { result, rerender } = renderHook(() => useLandingScreen());
    const firstCallback = result.current.handleLearnMore;
    
    rerender();
    const secondCallback = result.current.handleLearnMore;
    
    // Callbacks should be the same reference (memoized)
    expect(firstCallback).toBe(secondCallback);
  });
});

