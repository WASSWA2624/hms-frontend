/**
 * SearchBar Component Tests
 * File: SearchBar.test.js
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import SearchBarModule from '@platform/components/forms/SearchBar';
import SearchBarIndex from '@platform/components/forms/SearchBar/index.js';
import '@platform/components/forms/SearchBar/types.js';
import * as SearchBarTypesModule from '@platform/components/forms/SearchBar/types.js';
import lightTheme from '@theme/light.theme';

const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => mockEnTranslations[key] || key,
    tSync: (key) => mockEnTranslations[key] || key,
  }),
  useDebounce: jest.requireActual('@hooks').useDebounce,
}));

jest.mock('@platform/components/forms/TextField', () => {
  const React = require('react');
  const { TextInput, View, Text } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef(({
      value,
      onChange,
      onChangeText,
      onKeyPress,
      onSubmitEditing,
      placeholder,
      testID,
      accessibilityLabel,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...rest
    }, ref) => {
      const handleChangeText = (text) => {
        if (onChangeText) onChangeText(text);
        if (onChange) onChange({ target: { value: text } });
      };
      const testId = testID || dataTestId;
      const a11yLabel = accessibilityLabel || ariaLabel || placeholder;
      return (
        <View testID={testId ? `${testId}-container` : undefined} accessibilityLabel={a11yLabel}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onKeyPress={onKeyPress}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            testID={testId}
            accessibilityLabel={a11yLabel}
            {...(rest || {})}
          />
          {value && <Text testID={testId ? `${testId}-value` : undefined}>{value}</Text>}
        </View>
      );
    }),
  };
});

jest.mock('@platform/components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text, View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, onClick, onPress, testID, accessibilityLabel, ...rest }) => {
      const handlePress = onClick || onPress;
      return (
        <TouchableOpacity onPress={handlePress} testID={testID} accessibilityLabel={accessibilityLabel} {...rest}>
          <View>{typeof children === 'string' ? <Text>{children}</Text> : children}</View>
        </TouchableOpacity>
      );
    },
  };
});

const SearchBar = SearchBarModule.default || SearchBarModule;
void SearchBarIndex;
void SearchBarTypesModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar testID="search-bar" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with placeholder', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <SearchBar placeholder="Search products..." testID="search-bar" />
      );
      expect(getByPlaceholderText('Search products...')).toBeTruthy();
    });

    it('should use default i18n placeholder when placeholder is not provided', () => {
      const { getByPlaceholderText } = renderWithTheme(<SearchBar testID="search-bar" />);
      expect(getByPlaceholderText('common.searchPlaceholder')).toBeTruthy();
    });

    it('should render with value', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test query" testID="search-bar" />
      );
      expect(getByTestId('search-bar-input-value')).toBeTruthy();
    });

    it('should show clear button when value exists and showClearButton is true', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" showClearButton={true} testID="search-bar" />
      );
      expect(getByTestId('search-bar-clear')).toBeTruthy();
    });

    it('should not show clear button when showClearButton is false', () => {
      const { queryByTestId } = renderWithTheme(
        <SearchBar value="test" showClearButton={false} testID="search-bar" />
      );
      expect(queryByTestId('search-bar-clear')).toBeNull();
    });

    it('should not show clear button when value is empty', () => {
      const { queryByTestId } = renderWithTheme(
        <SearchBar value="" showClearButton={true} testID="search-bar" />
      );
      expect(queryByTestId('search-bar-clear')).toBeNull();
    });

    it('should render search icon', () => {
      const { getByTestId } = renderWithTheme(<SearchBar testID="search-bar" />);
      expect(getByTestId('search-bar-icon')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onChangeText when value changes (native)', () => {
      const handleChangeText = jest.fn();
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid onChangeText={handleChangeText} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'new query');
      });
      expect(handleChangeText).toHaveBeenCalledWith('new query');
    });

    it('should call onChange when value changes (web)', () => {
      const handleChange = jest.fn();
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb onChange={handleChange} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent.changeText(input, 'new query');
      });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onSearch when onSubmitEditing is called (native)', () => {
      const handleSearch = jest.fn();
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" onSearch={handleSearch} testID="search-bar-android" />
      );
      const input = getByTestId('search-bar-android-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should call onSearch when Enter key is pressed (web)', () => {
      const handleSearch = jest.fn();
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Enter' });
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should clear value when clear button is clicked', () => {
      const handleChangeText = jest.fn();
      const handleSearch = jest.fn();
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid
          value="test"
          onChangeText={handleChangeText}
          onSearch={handleSearch}
          testID="search-bar-android"
        />
      );
      const clearButton = getByTestId('search-bar-android-clear');
      act(() => {
        fireEvent.press(clearButton);
      });
      expect(handleChangeText).toHaveBeenCalledWith('');
      expect(handleSearch).toHaveBeenCalledWith('');
    });

    it('should handle clear when only onChange is provided', () => {
      const handleChange = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" onChange={handleChange} testID="search-bar" />
      );
      const clearButton = getByTestId('search-bar-clear');
      act(() => {
        fireEvent.press(clearButton);
        jest.runAllTimers();
      });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Debouncing', () => {
    it('should debounce onSearch calls', async () => {
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar value="" onSearch={handleSearch} debounceMs={300} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 't');
      });
      act(() => {
        fireEvent.changeText(input, 'te');
      });
      act(() => {
        fireEvent.changeText(input, 'tes');
      });
      act(() => {
        fireEvent.changeText(input, 'test');
      });
      expect(handleSearch).not.toHaveBeenCalled();
      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should use custom debounce delay', async () => {
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBar value="" onSearch={handleSearch} debounceMs={500} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
      });
      await act(async () => {
        jest.advanceTimersByTime(300);
        await Promise.resolve();
        await Promise.resolve();
      });
      expect(handleSearch).not.toHaveBeenCalled();
      await act(async () => {
        jest.advanceTimersByTime(200);
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should sync local value with prop value', () => {
      const { getByTestId, rerender } = renderWithTheme(
        <SearchBar value="initial" testID="search-bar" />
      );
      expect(getByTestId('search-bar-input-value')).toBeTruthy();
      rerender(
        <ThemeProvider theme={lightTheme}>
          <SearchBar value="updated" testID="search-bar" />
        </ThemeProvider>
      );
      act(() => {
        jest.runAllTimers();
      });
      expect(getByTestId('search-bar-input-value')).toBeTruthy();
    });

    it('should not call onSearch when debounced value equals prop value', () => {
      const handleSearch = jest.fn();
      renderWithTheme(
        <SearchBar value="test" onSearch={handleSearch} debounceMs={300} testID="search-bar" />
      );
      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar accessibilityLabel="Search products" testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      expect(input).toBeTruthy();
      expect(input.props.accessibilityLabel || input.props['aria-label']).toBeTruthy();
    });

    it('should have search icon with accessibility label', () => {
      const { getByTestId } = renderWithTheme(<SearchBar testID="search-bar" />);
      const icon = getByTestId('search-bar-icon');
      expect(icon).toBeTruthy();
      expect(icon.props.accessibilityLabel).toBe('common.searchIcon');
    });

    it('should have clear button with accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" testID="search-bar" />
      );
      const clearButton = getByTestId('search-bar-clear');
      expect(clearButton).toBeTruthy();
      expect(clearButton.props.accessibilityLabel).toBe('common.clearSearch');
    });
  });

  describe('Platform-specific implementations', () => {
    it('should test Web implementation', () => {
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" testID="search-bar-web" />
      );
      expect(getByTestId('search-bar-web-input-value')).toBeTruthy();
    });

    it('should test Web implementation with Enter key', () => {
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Enter' });
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should test Web implementation with non-Enter key (no submit)', () => {
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb value="test" onSearch={handleSearch} testID="search-bar-web" />
      );
      const input = getByTestId('search-bar-web-input');
      act(() => {
        fireEvent(input, 'keyPress', { key: 'Space' });
      });
      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('should test Android implementation', () => {
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" testID="search-bar-android" />
      );
      expect(getByTestId('search-bar-android-input-value')).toBeTruthy();
    });

    it('should test Android implementation with onSubmitEditing', () => {
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid value="test" onSearch={handleSearch} testID="search-bar-android" />
      );
      const input = getByTestId('search-bar-android-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('should test iOS implementation', () => {
      const SearchBarIOS = require('@platform/components/forms/SearchBar/SearchBar.ios').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS value="test" testID="search-bar-ios" />
      );
      expect(getByTestId('search-bar-ios-input-value')).toBeTruthy();
    });

    it('should test iOS implementation with onSubmitEditing', () => {
      const SearchBarIOS = require('@platform/components/forms/SearchBar/SearchBar.ios').default;
      const handleSearch = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SearchBarIOS value="test" onSearch={handleSearch} testID="search-bar-ios" />
      );
      const input = getByTestId('search-bar-ios-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined testID', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar value="test" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle empty string testID', () => {
      const { UNSAFE_root } = renderWithTheme(<SearchBar value="test" testID="" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle onChange without onChangeText', () => {
      const handleChange = jest.fn();
      const SearchBarWeb = require('@platform/components/forms/SearchBar/SearchBar.web').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarWeb onChange={handleChange} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
        jest.runAllTimers();
      });
      expect(handleChange).toHaveBeenCalled();
      expect(input).toBeTruthy();
    });

    it('should handle onChange with null (else branch)', () => {
      const handleChange = jest.fn();
      const useSearchBar = require('@platform/components/forms/SearchBar/useSearchBar').default;
      const TestComponent = () => {
        const { handleChange: hookHandleChange } = useSearchBar({
          value: '',
          onChange: handleChange,
        });
        React.useEffect(() => {
          hookHandleChange(null);
        }, []);
        return null;
      };
      renderWithTheme(<TestComponent />);
      act(() => {
        jest.runAllTimers();
      });
      expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
    });

    it('should handle onChangeText without onChange', () => {
      const handleChangeText = jest.fn();
      const SearchBarAndroid = require('@platform/components/forms/SearchBar/SearchBar.android').default;
      const { getByTestId } = renderWithTheme(
        <SearchBarAndroid onChangeText={handleChangeText} testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent.changeText(input, 'test');
      });
      expect(handleChangeText).toHaveBeenCalledWith('test');
    });

    it('should handle onSearch not provided', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" testID="search-bar" />
      );
      const input = getByTestId('search-bar-input');
      act(() => {
        fireEvent(input, 'submitEditing');
      });
      expect(input).toBeTruthy();
    });

    it('should handle custom debounceMs', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar debounceMs={1000} testID="search-bar" />
      );
      expect(getByTestId('search-bar-input')).toBeTruthy();
    });
  });

  describe('Index export', () => {
    it('should export default from index.js', () => {
      expect(SearchBar).toBeTruthy();
      expect(typeof SearchBar).toBe('function');
    });

    it('should render component exported from index.js', () => {
      const { getByTestId } = renderWithTheme(
        <SearchBar value="test" testID="search-bar-index" />
      );
      expect(getByTestId('search-bar-index-input-value')).toBeTruthy();
    });

    it('should execute index.js for coverage', () => {
      expect(SearchBarIndex).toBeTruthy();
      expect(typeof SearchBarIndex).toBe('function');
      expect(SearchBarIndex).toBe(SearchBar);
      const { getByTestId: getByTestIdIndex } = renderWithTheme(
        <SearchBarIndex value="test" testID="search-bar-index-exec" />
      );
      expect(getByTestIdIndex('search-bar-index-exec-input-value')).toBeTruthy();
    });

    it('should execute types.js for coverage', () => {
      expect(SearchBarTypesModule).toBeDefined();
      expect(typeof SearchBarTypesModule).toBe('object');
      expect(SearchBarTypesModule.types).toBeDefined();
      expect(typeof SearchBarTypesModule.types).toBe('object');
      expect(SearchBarTypesModule).not.toBeNull();
      expect(Object.keys(SearchBarTypesModule)).toContain('types');
    });
  });
});
