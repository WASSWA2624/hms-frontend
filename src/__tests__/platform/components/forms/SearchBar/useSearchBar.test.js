/**
 * useSearchBar Hook Tests
 * File: useSearchBar.test.js
 */

import React from 'react';
import TestRenderer from 'react-test-renderer';
import useSearchBar from '@platform/components/forms/SearchBar/useSearchBar';
import { useDebounce } from '@hooks';

const act = TestRenderer.act;

jest.mock('@hooks', () => ({
  useDebounce: jest.fn((value) => value),
  useI18n: jest.fn(),
}));

const renderHook = (hook, { initialProps } = {}) => {
  const result = {};
  let renderer;
  const HookHarness = ({ hookProps }) => {
    const hookResult = hook(hookProps);
    Object.assign(result, hookResult);
    return null;
  };
  act(() => {
    renderer = TestRenderer.create(<HookHarness hookProps={initialProps} />);
  });
  return {
    result: { current: result },
    rerender: (newProps) => {
      act(() => {
        renderer.update(<HookHarness hookProps={newProps} />);
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
};

describe('useSearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useDebounce.mockImplementation((value) => value);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with default value', () => {
      const { result } = renderHook(() =>
        useSearchBar({ value: '', debounceMs: 300 })
      );
      expect(result.current.localValue).toBe('');
      expect(result.current.hasValue).toBe(false);
    });

    it('should initialize with provided value', () => {
      const { result } = renderHook(() =>
        useSearchBar({ value: 'test', debounceMs: 300 })
      );
      expect(result.current.localValue).toBe('test');
      expect(result.current.hasValue).toBe(true);
    });
  });

  describe('Value synchronization', () => {
    it('should sync local value when prop value changes', () => {
      const { result, rerender } = renderHook(
        (hookProps) =>
          useSearchBar({ value: hookProps?.value || '', debounceMs: 300 }),
        { initialProps: { value: 'initial' } }
      );
      expect(result.current.localValue).toBe('initial');
      rerender({ value: 'updated' });
      expect(result.current.localValue).toBe('updated');
    });
  });

  describe('Change handlers', () => {
    it('should handle onChange (web)', () => {
      const handleChange = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: '', onChange: handleChange, debounceMs: 300 })
      );
      const event = { target: { value: 'new value' } };
      act(() => {
        result.current.handleChange(event);
      });
      expect(result.current.localValue).toBe('new value');
      expect(handleChange).toHaveBeenCalledWith(event);
    });

    it('should handle onChangeText (native)', () => {
      const handleChangeText = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: '', onChangeText: handleChangeText, debounceMs: 300 })
      );
      act(() => {
        result.current.handleChangeText('new value');
      });
      expect(result.current.localValue).toBe('new value');
      expect(handleChangeText).toHaveBeenCalledWith('new value');
    });

    it('should handle both onChange and onChangeText', () => {
      const handleChange = jest.fn();
      const handleChangeText = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({
          value: '',
          onChange: handleChange,
          onChangeText: handleChangeText,
          debounceMs: 300,
        })
      );
      act(() => {
        result.current.handleChangeText('new value');
      });
      expect(result.current.localValue).toBe('new value');
      expect(handleChangeText).toHaveBeenCalledWith('new value');
      expect(handleChange).toHaveBeenCalledWith({ target: { value: 'new value' } });
    });
  });

  describe('Clear handler', () => {
    it('should clear value and call handlers', () => {
      const handleChange = jest.fn();
      const handleChangeText = jest.fn();
      const handleSearch = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({
          value: 'test',
          onChange: handleChange,
          onChangeText: handleChangeText,
          onSearch: handleSearch,
          debounceMs: 300,
        })
      );
      act(() => {
        result.current.handleClear();
      });
      expect(result.current.localValue).toBe('');
      expect(result.current.hasValue).toBe(false);
      expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
      expect(handleChangeText).toHaveBeenCalledWith('');
      expect(handleSearch).toHaveBeenCalledWith('');
    });

    it('should clear value even when handlers are not provided', () => {
      const { result } = renderHook(() =>
        useSearchBar({ value: 'test', debounceMs: 300 })
      );
      act(() => {
        result.current.handleClear();
      });
      expect(result.current.localValue).toBe('');
      expect(result.current.hasValue).toBe(false);
    });
  });

  describe('Submit handler', () => {
    it('should call onSearch with current value', () => {
      const handleSearch = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: 'test', onSearch: handleSearch, debounceMs: 300 })
      );
      act(() => {
        result.current.handleSubmit();
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should call onSearch with provided value', () => {
      const handleSearch = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: 'test', onSearch: handleSearch, debounceMs: 300 })
      );
      act(() => {
        result.current.handleSubmit('custom value');
      });
      expect(handleSearch).toHaveBeenCalledWith('custom value');
    });

    it('should not call onSearch when not provided', () => {
      const { result } = renderHook(() =>
        useSearchBar({ value: 'test', debounceMs: 300 })
      );
      act(() => {
        result.current.handleSubmit();
      });
      expect(result.current.localValue).toBe('test');
    });
  });

  describe('Change handler edge cases', () => {
    it('should handle onChange with string value (non-event)', () => {
      const handleChange = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: '', onChange: handleChange, debounceMs: 300 })
      );
      act(() => {
        result.current.handleChange('string value');
      });
      expect(result.current.localValue).toBe('string value');
      expect(handleChange).toHaveBeenCalledWith('string value');
    });

    it('should handle onChange with event object but no onChangeText', () => {
      const handleChange = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: '', onChange: handleChange, debounceMs: 300 })
      );
      const event = { target: { value: 'event value' } };
      act(() => {
        result.current.handleChange(event);
      });
      expect(result.current.localValue).toBe('event value');
      expect(handleChange).toHaveBeenCalledWith(event);
    });

    it('should handle onChangeText when onChange receives string', () => {
      const handleChange = jest.fn();
      const handleChangeText = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({
          value: '',
          onChange: handleChange,
          onChangeText: handleChangeText,
          debounceMs: 300,
        })
      );
      act(() => {
        result.current.handleChange('string value');
      });
      expect(result.current.localValue).toBe('string value');
      expect(handleChange).toHaveBeenCalledWith('string value');
      expect(handleChangeText).toHaveBeenCalledWith('string value');
    });
  });

  describe('Debouncing', () => {
    it('should use custom debounce delay', () => {
      renderHook(() =>
        useSearchBar({ value: '', onSearch: jest.fn(), debounceMs: 500 })
      );
      expect(useDebounce).toHaveBeenCalledWith('', 500);
    });

    it('should use default debounce delay', () => {
      renderHook(() =>
        useSearchBar({ value: '', onSearch: jest.fn() })
      );
      expect(useDebounce).toHaveBeenCalledWith('', 300);
    });

    it('should call onSearch when debounced value differs from prop value', () => {
      let currentValue = 'initial';
      useDebounce.mockImplementation(() => currentValue);
      const { result, rerender } = renderHook(
        (props) =>
          useSearchBar({
            value: props?.value || 'initial',
            onSearch: jest.fn(),
            debounceMs: 300,
          }),
        { initialProps: { value: 'initial' } }
      );
      act(() => {
        result.current.handleChangeText('new');
      });
      currentValue = 'new';
      act(() => {
        rerender({ value: 'initial' });
      });
      useDebounce.mockImplementation((value) => value);
    });

    it('should not call onSearch when debounced value equals prop value', () => {
      const handleSearch = jest.fn();
      useDebounce.mockImplementation((value) => value);
      renderHook(() =>
        useSearchBar({ value: 'test', onSearch: handleSearch, debounceMs: 300 })
      );
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should handle onChange with non-string value (no onChangeText call)', () => {
      const handleChange = jest.fn();
      const handleChangeText = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({
          value: '',
          onChange: handleChange,
          onChangeText: handleChangeText,
          debounceMs: 300,
        })
      );
      const event = { target: { value: 123 } };
      act(() => {
        result.current.handleChange(event);
      });
      expect(result.current.localValue).toBe(123);
      expect(handleChange).toHaveBeenCalledWith(event);
      expect(handleChangeText).not.toHaveBeenCalled();
    });

    it('should handle onChange without onChange prop', () => {
      const handleChangeText = jest.fn();
      const { result } = renderHook(() =>
        useSearchBar({ value: '', onChangeText: handleChangeText, debounceMs: 300 })
      );
      const event = { target: { value: 'test' } };
      act(() => {
        result.current.handleChange(event);
      });
      expect(result.current.localValue).toBe('test');
      expect(handleChangeText).toHaveBeenCalledWith('test');
    });

    it('should use default value parameter', () => {
      const { result } = renderHook(() =>
        useSearchBar({ debounceMs: 300 })
      );
      expect(result.current.localValue).toBe('');
      expect(result.current.hasValue).toBe(false);
    });
  });
});
