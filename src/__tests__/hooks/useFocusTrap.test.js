/**
 * useFocusTrap Hook Tests
 * File: useFocusTrap.test.js
 */
import React, { useRef } from 'react';
import { render } from '@testing-library/react-native';
import useFocusTrap from '@hooks/useFocusTrap';

const createFocusable = (name) => ({
  name,
  focus: jest.fn(),
  hasAttribute: jest.fn(() => false),
  getAttribute: jest.fn(() => null),
});

const TestComponent = ({ containerRef, isActive, options }) => {
  useFocusTrap(containerRef, isActive, options);
  return null;
};

describe('useFocusTrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing when inactive', () => {
    global.document = { activeElement: null };
    const container = { querySelectorAll: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() };
    const containerRef = { current: container };

    render(<TestComponent containerRef={containerRef} isActive={false} />);

    expect(container.addEventListener).not.toHaveBeenCalled();
  });

  it('adds keydown handler and traps focus', () => {
    const first = createFocusable('first');
    const last = createFocusable('last');
    const focusables = [first, last];

    const eventHandlers = {};
    const container = {
      querySelectorAll: jest.fn(() => focusables),
      addEventListener: jest.fn((type, handler) => {
        eventHandlers[type] = handler;
      }),
      removeEventListener: jest.fn(),
    };
    const containerRef = { current: container };

    let active = last;
    global.document = {};
    Object.defineProperty(global.document, 'activeElement', {
      get() {
        return active;
      },
      set(v) {
        active = v;
      },
      configurable: true,
    });

    const { unmount } = render(<TestComponent containerRef={containerRef} isActive />);

    // Focus initial (first element)
    expect(first.focus).toHaveBeenCalled();
    expect(container.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

    const handler = eventHandlers.keydown;
    const preventDefault = jest.fn();

    // Tab forward from last -> wraps to first
    handler({ key: 'Tab', shiftKey: false, preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(first.focus).toHaveBeenCalledTimes(2);

    // Shift+Tab backward from first -> wraps to last
    active = first;
    handler({ key: 'Tab', shiftKey: true, preventDefault });
    expect(last.focus).toHaveBeenCalled();

    unmount();
    expect(container.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('focuses initialFocusRef when provided', () => {
    const first = createFocusable('first');
    const preferred = createFocusable('preferred');
    const focusables = [first];

    const container = {
      querySelectorAll: jest.fn(() => focusables),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const containerRef = { current: container };

    global.document = { activeElement: null };

    const Wrapper = () => {
      const initialFocusRef = useRef(preferred);
      useFocusTrap(containerRef, true, { initialFocusRef });
      return null;
    };

    render(<Wrapper />);

    expect(preferred.focus).toHaveBeenCalled();
    expect(first.focus).not.toHaveBeenCalled();
  });
});

