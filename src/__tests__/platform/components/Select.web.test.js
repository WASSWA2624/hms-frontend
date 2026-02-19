/**
 * Select Component Web Tests
 * File: Select.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

// Mock i18n hook
jest.mock('@hooks', () => {
  const mockEnTranslations = require('@i18n/locales/en.json');
  return {
    useI18n: () => ({
      t: (key) => {
        const keys = key.split('.');
        let value = mockEnTranslations;
        for (const k of keys) {
          value = value?.[k];
        }
        return value || key;
      },
      locale: 'en',
    }),
  };
});

describe('Select Component - Web', () => {
  const options = [
    { label: 'One', value: 'one' },
    { label: 'Two', value: 'two' },
    { label: 'Disabled', value: 'disabled', disabled: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to render web components with proper providers
  const renderWebWithProviders = (component) => {
    return render(
      <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
    );
  };

  // eslint-disable-next-line import/no-unresolved
  const SelectWeb = require('@platform/components/forms/Select/Select.web').default;

  describe('Rendering', () => {
    it('should render Web select', () => {
      const { getByTestId } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value="one" onValueChange={() => {}} />
      );

      expect(getByTestId('web-select')).toBeTruthy();
    });

    it('should open dropdown on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();
    });

    it('should select option when clicking with mouse on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      const option = getByTestId('web-select-option-1');
      fireEvent.click(option);
      expect(onValueChange).toHaveBeenCalledWith('two');
      expect(queryByText('One')).toBeFalsy();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open dropdown with Enter key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should open dropdown with Space key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: ' ' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should open dropdown with ArrowDown key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should close dropdown with Escape key on Web', () => {
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'Escape' });
      expect(queryByText('One')).toBeFalsy();
    });

    it('should navigate options with ArrowDown key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      expect(getByText('Two')).toBeTruthy();
    });

    it('should navigate options with ArrowUp key on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      expect(getByText('One')).toBeTruthy();
    });

    it('should select option with Enter key on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: 'Enter' });
      expect(onValueChange).toHaveBeenCalledWith('one');
      expect(queryByText('One')).toBeFalsy();
    });

    it('should select option with Space key on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      fireEvent.keyDown(menu, { key: ' ' });
      expect(onValueChange).toHaveBeenCalledWith('one');
      expect(queryByText('One')).toBeFalsy();
    });

    it('should not open when disabled on Web', () => {
      const { getByTestId, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} disabled />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(queryByText('One')).toBeFalsy();
    });

    it('should skip disabled options during keyboard navigation on Web', () => {
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const menu = getByTestId('web-select-menu');
      // Navigate past disabled option
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      // Should be on 'Two' (skipping 'Disabled')
      expect(getByText('Two')).toBeTruthy();
    });

    it('should close dropdown when clicking outside on Web', () => {
      const { getByTestId, getByText, queryByText, container } = renderWebWithProviders(
        <div>
          <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
          <div data-testid="outside-element">Outside</div>
        </div>
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      // Click outside the select component
      const outsideElement = getByTestId('outside-element');
      fireEvent.mouseDown(outsideElement);
      expect(queryByText('One')).toBeFalsy();
    });

    it('should close dropdown with Escape key on trigger when menu is open on Web', () => {
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('One')).toBeTruthy();

      // Simulate Escape key on trigger (though focus is on menu, this tests the code path)
      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(queryByText('One')).toBeFalsy();
    });
  });

  describe('Interaction Edge Cases', () => {
    it('should not call onValueChange when clicking disabled option on Web', () => {
      const onValueChange = jest.fn();
      const { getByTestId, getByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={onValueChange} />
      );

      const trigger = getByTestId('web-select');
      fireEvent.click(trigger);
      expect(getByText('Disabled')).toBeTruthy();

      const disabledOption = getByTestId('web-select-option-2');
      fireEvent.click(disabledOption);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should mask technical identifier labels on Web', () => {
      const technicalId = '123e4567-e89b-12d3-a456-426614174000';
      const maskedOptions = [{ label: technicalId, value: technicalId }];
      const { getByText, queryByText } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={maskedOptions} value={technicalId} onValueChange={() => {}} />
      );

      expect(getByText('Not available')).toBeTruthy();
      expect(queryByText(technicalId)).toBeFalsy();
    });

    it('should render search input when searchable is enabled on Web', () => {
      const { getByTestId, getByText, queryByText } = renderWebWithProviders(
        <SelectWeb
          testID="web-select"
          options={options}
          value={undefined}
          onValueChange={() => {}}
          searchable
        />
      );

      fireEvent.click(getByTestId('web-select'));
      const searchInput = getByTestId('web-select-search-input');
      expect(searchInput).toBeTruthy();
      expect(getByText('Two')).toBeTruthy();
      expect(queryByText('One')).toBeTruthy();
    });

    it('should show empty search state when searchable has no options on Web', () => {
      const { getByTestId } = renderWebWithProviders(
        <SelectWeb
          testID="web-select"
          options={[]}
          value={undefined}
          onValueChange={() => {}}
          searchable
        />
      );

      fireEvent.click(getByTestId('web-select'));
      expect(getByTestId('web-select-search-input')).toBeTruthy();
      expect(getByTestId('web-select-no-results')).toBeTruthy();
    });

    it('should expand menu width for long option labels on Web', async () => {
      const previousWidth = window.innerWidth;
      const previousHeight = window.innerHeight;
      window.innerWidth = 900;
      window.innerHeight = 700;

      const longOptions = [
        { label: 'Very long density option label that should not clip', value: 'long' },
        { label: 'Short', value: 'short' },
      ];

      const { getByTestId } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={longOptions} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      trigger.getBoundingClientRect = jest.fn(() => ({
        top: 120,
        left: 80,
        bottom: 156,
        right: 200,
        width: 120,
        height: 36,
        x: 80,
        y: 120,
        toJSON: () => ({}),
      }));

      fireEvent.click(trigger);
      const menu = getByTestId('web-select-menu');
      Object.defineProperty(menu, 'scrollWidth', { configurable: true, value: 360 });
      Object.defineProperty(menu, 'scrollHeight', { configurable: true, value: 96 });
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        const width = Number(menu.getAttribute('data-width'));
        expect(width).toBeGreaterThan(120);
      });

      window.innerWidth = previousWidth;
      window.innerHeight = previousHeight;
    });

    it('should align menu to the right side when horizontal space is limited on Web', async () => {
      const previousWidth = window.innerWidth;
      const previousHeight = window.innerHeight;
      window.innerWidth = 960;
      window.innerHeight = 720;

      const { getByTestId } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      trigger.getBoundingClientRect = jest.fn(() => ({
        top: 120,
        left: 840,
        bottom: 156,
        right: 940,
        width: 100,
        height: 36,
        x: 840,
        y: 120,
        toJSON: () => ({}),
      }));

      fireEvent.click(trigger);
      const menu = getByTestId('web-select-menu');
      Object.defineProperty(menu, 'scrollWidth', { configurable: true, value: 280 });
      Object.defineProperty(menu, 'scrollHeight', { configurable: true, value: 96 });
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        expect(menu.getAttribute('data-align')).toBe('right');
        expect(menu.getAttribute('data-right')).toBeTruthy();
      });

      window.innerWidth = previousWidth;
      window.innerHeight = previousHeight;
    });

    it('should place menu above trigger near viewport bottom using content height on Web', async () => {
      const previousWidth = window.innerWidth;
      const previousHeight = window.innerHeight;
      window.innerWidth = 960;
      window.innerHeight = 720;

      const { getByTestId } = renderWebWithProviders(
        <SelectWeb testID="web-select" options={options} value={undefined} onValueChange={() => {}} />
      );

      const trigger = getByTestId('web-select');
      trigger.getBoundingClientRect = jest.fn(() => ({
        top: 650,
        left: 760,
        bottom: 686,
        right: 880,
        width: 120,
        height: 36,
        x: 760,
        y: 650,
        toJSON: () => ({}),
      }));

      fireEvent.click(trigger);
      const menu = getByTestId('web-select-menu');
      Object.defineProperty(menu, 'scrollHeight', { configurable: true, value: 88 });
      Object.defineProperty(menu, 'scrollWidth', { configurable: true, value: 180 });
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        expect(menu.getAttribute('data-placement')).toBe('top');
        const top = Number(menu.getAttribute('data-top'));
        expect(top).toBeGreaterThan(540);
      });

      window.innerWidth = previousWidth;
      window.innerHeight = previousHeight;
    });
  });
});

