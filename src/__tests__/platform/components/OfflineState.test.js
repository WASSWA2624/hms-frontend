/**
 * OfflineState Component Tests
 * File: OfflineState.test.js
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import OfflineState, { SIZES } from '@platform/components/states/OfflineState';
import Icon from '@platform/components/display/Icon';
import Button from '@platform/components/Button';
import lightTheme from '@theme/light.theme';

// Mock i18n hook
const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key, params = {}) => {
      const keys = key.split('.');
      let value = mockEnTranslations;
      for (const k of keys) {
        value = value?.[k];
      }
      if (typeof value === 'string' && params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? String(params[paramKey]) : match;
        });
      }
      return value || key;
    },
    locale: 'en',
  }),
}));

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('OfflineState Component', () => {
  describe('Rendering', () => {
    it('should render with title only', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="No internet connection" testID="offline-state" />
      );
      expect(getByText('No internet connection')).toBeTruthy();
    });

    it('should render with title and description', () => {
      const { getByText } = renderWithTheme(
        <OfflineState
          title="No internet connection"
          description="Please check your connection and try again"
          testID="offline-state"
        />
      );
      expect(getByText('No internet connection')).toBeTruthy();
      expect(getByText('Please check your connection and try again')).toBeTruthy();
    });

    it('should render with icon', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState
          title="No internet connection"
          icon={<Icon glyph="wifi-off" accessibilityLabel="Offline icon" />}
          testID="offline-state"
        />
      );
      const offlineState = getByTestId('offline-state');
      expect(offlineState).toBeTruthy();
      expect(offlineState.children.length).toBeGreaterThan(0);
    });

    it('should render with retry action', () => {
      const { getByText } = renderWithTheme(
        <OfflineState
          title="No internet connection"
          action={<Button>Retry</Button>}
          testID="offline-state"
        />
      );
      expect(getByText('Retry')).toBeTruthy();
    });

    it('should render all elements together', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <OfflineState
          title="No internet connection"
          description="Please check your connection and try again"
          icon={<Icon glyph="wifi-off" accessibilityLabel="Offline icon" />}
          action={<Button>Retry</Button>}
          testID="offline-state"
        />
      );
      expect(getByText('No internet connection')).toBeTruthy();
      expect(getByText('Please check your connection and try again')).toBeTruthy();
      const offlineState = getByTestId('offline-state');
      expect(offlineState).toBeTruthy();
      expect(offlineState.children.length).toBeGreaterThan(0);
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" size="small" testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" size="large" testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is invalid', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" size="invalid-size" testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is null', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" size={null} testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });

    it('should fallback to medium size when size is undefined', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" size={undefined} testID="offline-state" />
      );
      expect(getByTestId('offline-state')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have status role (web) or none (native)', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" testID="offline-state" />
      );
      const offlineState = getByTestId('offline-state');
      const role = offlineState.props.accessibilityRole || offlineState.props.role;
      // Web: role="status"; React Native: accessibilityRole="none" (status not supported)
      expect(['status', 'none']).toContain(role);
    });

    it('should use custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <OfflineState title="Offline" accessibilityLabel="No internet connection" testID="offline-state" />
      );
      expect(getByLabelText('No internet connection')).toBeTruthy();
    });

    it('should use title as accessibility label when not provided', () => {
      const { getByLabelText } = renderWithTheme(
        <OfflineState title="No internet connection" testID="offline-state" />
      );
      expect(getByLabelText('No internet connection')).toBeTruthy();
    });

    it('should handle non-string title for accessibility label', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title={<span>React Node Title</span>} testID="offline-state" />
      );
      const offlineState = getByTestId('offline-state');
      // When title is not a string, aria-label should be undefined or use custom accessibilityLabel
      expect(offlineState).toBeTruthy();
    });

    it('should handle React node title', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title={<span>Custom Title</span>} testID="offline-state" />
      );
      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('should handle React node description', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Title" description={<span>Custom Description</span>} testID="offline-state" />
      );
      expect(getByText('Custom Description')).toBeTruthy();
    });

    it('should render without icon', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Offline" testID="offline-state" />
      );
      expect(getByText('Offline')).toBeTruthy();
    });

    it('should render without description', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Offline" testID="offline-state" />
      );
      expect(getByText('Offline')).toBeTruthy();
    });

    it('should render without action', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Offline" testID="offline-state" />
      );
      expect(getByText('Offline')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Offline" testID="test-offline-state" />
      );
      expect(getByTestId('test-offline-state')).toBeTruthy();
    });
  });

  describe('Constants Export', () => {
    it('should export SIZES constant', () => {
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });
  });

  describe('Platform-specific implementations', () => {
    describe('Android Platform', () => {
      // eslint-disable-next-line import/no-unresolved
      const OfflineStateAndroid = require('@platform/components/states/OfflineState/OfflineState.android').default;

      it('should render Android version', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateAndroid title="Android Offline State" testID="offline-state-android" />
        );
        expect(getByText('Android Offline State')).toBeTruthy();
      });

      it('should have accessibilityRole="none" on Android', () => {
        const { getByTestId } = renderWithTheme(
          <OfflineStateAndroid title="Android Offline State" testID="offline-state-android" />
        );
        const offlineState = getByTestId('offline-state-android');
        expect(offlineState.props.accessibilityRole).toBe('none');
      });

      it('should use custom accessibility label on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateAndroid title="Android Offline State" accessibilityLabel="Custom Android label" testID="offline-state-android" />
        );
        expect(getByLabelText('Custom Android label')).toBeTruthy();
      });

      it('should render Android version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <OfflineStateAndroid
            title="Android Offline State"
            icon={<Icon glyph="wifi-off" accessibilityLabel="Icon" />}
            testID="offline-state-android"
          />
        );
        expect(getByText('Android Offline State')).toBeTruthy();
        expect(getByTestId('offline-state-android')).toBeTruthy();
      });

      it('should render Android version with description', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateAndroid
            title="Android Offline State"
            description="Android description"
            testID="offline-state-android"
          />
        );
        expect(getByText('Android Offline State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
      });

      it('should render Android version with action', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateAndroid
            title="Android Offline State"
            action={<Button>Android Action</Button>}
            testID="offline-state-android"
          />
        );
        expect(getByText('Android Offline State')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
      });

      it('should render Android version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <OfflineStateAndroid
            title="Android Offline State"
            description="Android description"
            icon={<Icon glyph="wifi-off" accessibilityLabel="Icon" />}
            action={<Button>Android Action</Button>}
            testID="offline-state-android"
          />
        );
        expect(getByText('Android Offline State')).toBeTruthy();
        expect(getByText('Android description')).toBeTruthy();
        expect(getByText('Android Action')).toBeTruthy();
        expect(getByTestId('offline-state-android')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateAndroid title="Title Only" testID="offline-state-android" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should use i18n accessibility fallback when title is React node on Android', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateAndroid title={<span>React Title</span>} testID="offline-state-android" />
        );
        const expectedLabel = mockEnTranslations?.common?.offlineState || 'common.offlineState';
        expect(getByLabelText(expectedLabel)).toBeTruthy();
      });
    });

    describe('iOS Platform', () => {
      // eslint-disable-next-line import/no-unresolved
      const OfflineStateIOS = require('@platform/components/states/OfflineState/OfflineState.ios').default;

      it('should render iOS version', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateIOS title="iOS Offline State" testID="offline-state-ios" />
        );
        expect(getByText('iOS Offline State')).toBeTruthy();
      });

      it('should have accessibilityRole="none" on iOS', () => {
        const { getByTestId } = renderWithTheme(
          <OfflineStateIOS title="iOS Offline State" testID="offline-state-ios" />
        );
        const offlineState = getByTestId('offline-state-ios');
        expect(offlineState.props.accessibilityRole).toBe('none');
      });

      it('should use custom accessibility label on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateIOS title="iOS Offline State" accessibilityLabel="Custom iOS label" testID="offline-state-ios" />
        );
        expect(getByLabelText('Custom iOS label')).toBeTruthy();
      });

      it('should render iOS version with icon', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <OfflineStateIOS
            title="iOS Offline State"
            icon={<Icon glyph="wifi-off" accessibilityLabel="Icon" />}
            testID="offline-state-ios"
          />
        );
        expect(getByText('iOS Offline State')).toBeTruthy();
        expect(getByTestId('offline-state-ios')).toBeTruthy();
      });

      it('should render iOS version with description', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateIOS
            title="iOS Offline State"
            description="iOS description"
            testID="offline-state-ios"
          />
        );
        expect(getByText('iOS Offline State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
      });

      it('should render iOS version with action', () => {
        const { getByText } = renderWithTheme(
          <OfflineStateIOS
            title="iOS Offline State"
            action={<Button>iOS Action</Button>}
            testID="offline-state-ios"
          />
        );
        expect(getByText('iOS Offline State')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
      });

      it('should render iOS version with all props', () => {
        const { getByText, getByTestId } = renderWithTheme(
          <OfflineStateIOS
            title="iOS Offline State"
            description="iOS description"
            icon={<Icon glyph="wifi-off" accessibilityLabel="Icon" />}
            action={<Button>iOS Action</Button>}
            testID="offline-state-ios"
          />
        );
        expect(getByText('iOS Offline State')).toBeTruthy();
        expect(getByText('iOS description')).toBeTruthy();
        expect(getByText('iOS Action')).toBeTruthy();
        expect(getByTestId('offline-state-ios')).toBeTruthy();
      });

      it('should use title as accessibility label when accessibilityLabel not provided on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateIOS title="Title Only" testID="offline-state-ios" />
        );
        expect(getByLabelText('Title Only')).toBeTruthy();
      });

      it('should use i18n accessibility fallback when title is React node on iOS', () => {
        const { getByLabelText } = renderWithTheme(
          <OfflineStateIOS title={<span>React Title</span>} testID="offline-state-ios" />
        );
        const expectedLabel = mockEnTranslations?.common?.offlineState || 'common.offlineState';
        expect(getByLabelText(expectedLabel)).toBeTruthy();
      });
    });
  });

  describe('Index barrel export', () => {
    it('should export default component', () => {
      expect(OfflineState).toBeDefined();
      expect(typeof OfflineState).toBe('function');
    });

    it('should export SIZES from index', () => {
      // SIZES is already tested in Constants Export, but verify it's accessible via index
      expect(SIZES).toBeDefined();
      expect(SIZES.SMALL).toBe('small');
      expect(SIZES.MEDIUM).toBe('medium');
      expect(SIZES.LARGE).toBe('large');
    });

    it('should render default export (web version)', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Test Title" testID="offline-state" />
      );
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should import and use index barrel exports', () => {
      // Explicitly test that index.js exports work
      // eslint-disable-next-line import/no-unresolved
      const IndexExports = require('@platform/components/states/OfflineState/index.js');
      expect(IndexExports.default).toBeDefined();
      expect(IndexExports.SIZES).toBeDefined();
      expect(IndexExports.SIZES.SMALL).toBe('small');
      expect(IndexExports.SIZES.MEDIUM).toBe('medium');
      expect(IndexExports.SIZES.LARGE).toBe('large');
    });
  });

  describe('Web Platform specific', () => {
    // eslint-disable-next-line import/no-unresolved
    const OfflineStateWeb = require('@platform/components/states/OfflineState/OfflineState.web').default;

    it('should have role="status" on web', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineStateWeb title="Web Offline State" testID="offline-state-web" />
      );
      const offlineState = getByTestId('offline-state-web');
      const role = offlineState.props.role ?? offlineState.props.accessibilityRole;
      expect(role).toBe('status');
    });

    it('should use aria-label on web', () => {
      const { getByLabelText } = renderWithTheme(
        <OfflineStateWeb title="Web Offline State" testID="offline-state-web" />
      );
      expect(getByLabelText('Web Offline State')).toBeTruthy();
    });

    it('should accept className prop on web', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineStateWeb title="Web Offline State" className="custom-class" testID="offline-state-web" />
      );
      const offlineState = getByTestId('offline-state-web');
      expect(offlineState.props.className).toBe('custom-class');
    });

    it('should prioritize custom accessibility label on web', () => {
      const { getByLabelText } = renderWithTheme(
        <OfflineStateWeb
          title="Web Offline State"
          accessibilityLabel="Custom web offline label"
          testID="offline-state-web"
        />
      );
      expect(getByLabelText('Custom web offline label')).toBeTruthy();
    });

    it('should use i18n accessibility fallback for non-string title on web', () => {
      const { getByLabelText } = renderWithTheme(
        <OfflineStateWeb title={<span>Web Offline State</span>} testID="offline-state-web" />
      );
      const expectedLabel = mockEnTranslations?.common?.offlineState || 'common.offlineState';
      expect(getByLabelText(expectedLabel)).toBeTruthy();
    });

    it('should render icon, description, and action branches on web', () => {
      const { getByText } = renderWithTheme(
        <OfflineStateWeb
          title="Web Offline State"
          description="Web offline description"
          icon={<Icon glyph="wifi-off" accessibilityLabel="Offline icon" />}
          action={<Button>Retry</Button>}
          testID="offline-state-web"
        />
      );
      expect(getByText('Web offline description')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string title', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="" testID="offline-state" />
      );
      const offlineState = getByTestId('offline-state');
      expect(offlineState).toBeTruthy();
    });

    it('should handle empty string description', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Title" description="" testID="offline-state" />
      );
      const offlineState = getByTestId('offline-state');
      expect(offlineState).toBeTruthy();
    });

    it('should handle falsy icon', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Title" icon={null} testID="offline-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle falsy action', () => {
      const { getByText } = renderWithTheme(
        <OfflineState title="Title" action={null} testID="offline-state" />
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should handle style prop', () => {
      const { getByTestId } = renderWithTheme(
        <OfflineState title="Title" style={{ backgroundColor: 'red' }} testID="offline-state" />
      );
      const offlineState = getByTestId('offline-state');
      expect(offlineState).toBeTruthy();
    });
  });
});

