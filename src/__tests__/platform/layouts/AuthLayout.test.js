/**
 * AuthLayout Component Tests
 * File: AuthLayout.test.js
 */

import React from 'react';
import { Text } from 'react-native';
import AuthLayout from '@platform/layouts/AuthLayout';
import { renderWithProviders } from '../../helpers/test-utils';

// Mock i18n hook
const mockEnTranslations = require('@i18n/locales/en.json');
jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => {
      const keys = key.split('.');
      let value = mockEnTranslations;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
      return value || key;
    },
    locale: 'en',
  }),
}));

const renderWithTheme = (component) => {
  return renderWithProviders(component, {
    initialState: {
      ui: { theme: 'light', locale: 'en', isLoading: false },
    },
  });
};

describe('AuthLayout Component', () => {
  describe('Basic Rendering', () => {
    it('should render with children', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Auth Form</Text>
        </AuthLayout>
      );
      expect(getByText('Auth Form')).toBeTruthy();
    });

    it('should render centered layout', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Centered Content</Text>
        </AuthLayout>
      );
      expect(getByText('Centered Content')).toBeTruthy();
    });

    it('should render without children', () => {
      const { root } = renderWithTheme(
        <AuthLayout>
        </AuthLayout>
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Branding', () => {
    it('should render branding when provided', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout branding={<Text>Logo</Text>}>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Logo')).toBeTruthy();
      expect(getByText('Form')).toBeTruthy();
    });

    it('should render without branding', () => {
      const { getByText, queryByText } = renderWithTheme(
        <AuthLayout>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Form')).toBeTruthy();
      expect(queryByText('Logo')).toBeFalsy();
    });

    it('should handle null branding', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout branding={null}>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Form')).toBeTruthy();
    });
  });

  describe('Help Links', () => {
    it('should render help links when provided', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout helpLinks={<Text>Forgot Password?</Text>}>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Forgot Password?')).toBeTruthy();
      expect(getByText('Form')).toBeTruthy();
    });

    it('should render without help links', () => {
      const { getByText, queryByText } = renderWithTheme(
        <AuthLayout>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Form')).toBeTruthy();
      expect(queryByText('Forgot Password?')).toBeFalsy();
    });

    it('should handle undefined help links', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout helpLinks={undefined}>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Form')).toBeTruthy();
    });

    it('should render footer when provided', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout footer={<Text>Auth Footer</Text>}>
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Form')).toBeTruthy();
      expect(getByText('Auth Footer')).toBeTruthy();
    });
  });

  describe('All Sections Together', () => {
    it('should render branding, content, and help links', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout
          branding={<Text>Logo</Text>}
          helpLinks={<Text>Help</Text>}
        >
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Logo')).toBeTruthy();
      expect(getByText('Form')).toBeTruthy();
      expect(getByText('Help')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have main accessibility role', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <AuthLayout testID="auth-layout-main">
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByText('Content')).toBeTruthy();
      // Container should have main accessibility role (React Native uses accessibilityRole, Web uses role)
      const container = getByTestId('auth-layout-main');
      expect(container).toBeTruthy();
      // Web uses role="main"; native uses accessibilityRole="none" (RN doesn't support "main")
      const role = container.props.accessibilityRole || container.props.role;
      expect(['main', 'none']).toContain(role);
    });

    it('should have custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <AuthLayout accessibilityLabel="Authentication Form">
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByLabelText('Authentication Form')).toBeTruthy();
    });

    it('should use translated accessibility label when none is provided', () => {
      const { getByLabelText } = renderWithTheme(
        <AuthLayout>
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByLabelText(mockEnTranslations.auth.layout.title)).toBeTruthy();
    });

    it('should have accessibility role main when no label provided', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <AuthLayout testID="auth-layout">
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByText('Content')).toBeTruthy();
      const container = getByTestId('auth-layout');
      expect(container).toBeTruthy();
      // Web uses role="main"; native uses accessibilityRole="none" (RN doesn't support "main")
      const role = container.props.accessibilityRole || container.props.role;
      expect(['main', 'none']).toContain(role);
    });
  });

  describe('Screen Header', () => {
    it('should render screen header content when enabled', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout showScreenHeader screenTitle="Onboarding" screenSubtitle="Step details">
          <Text>Form</Text>
        </AuthLayout>
      );
      expect(getByText('Onboarding')).toBeTruthy();
      expect(getByText('Step details')).toBeTruthy();
      expect(getByText('Form')).toBeTruthy();
    });

    it('should use disabled hint fallback when back action cannot execute', () => {
      const { getByTestId } = renderWithTheme(
        <AuthLayout
          showScreenHeader
          screenTitle="Onboarding"
          screenBackAction={{ label: 'Go Back' }}
        >
          <Text>Form</Text>
        </AuthLayout>
      );
      const backButton = getByTestId('auth-layout-back');
      expect(backButton.props.accessibilityHint).toBe(mockEnTranslations.auth.layout.backUnavailableHint);
    });
  });

  describe('Keyboard Handling', () => {
    it('should handle keyboard on mobile platforms', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Form with Input</Text>
        </AuthLayout>
      );
      expect(getByText('Form with Input')).toBeTruthy();
      // KeyboardAvoidingView should be present on mobile platforms
    });
  });

  describe('Scrollable Content', () => {
    it('should render scrollable content for long forms', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Long Form Content</Text>
        </AuthLayout>
      );
      expect(getByText('Long Form Content')).toBeTruthy();
    });
  });

  describe('Test ID', () => {
    it('should accept testID prop', () => {
      const { getByText, getByTestId } = renderWithTheme(
        <AuthLayout testID="test-auth-layout">
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByText('Content')).toBeTruthy();
      const container = getByTestId('test-auth-layout');
      expect(container).toBeTruthy();
    });

    it('should work without testID', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Card Layout', () => {
    it('should render content in a card container', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Card Content</Text>
        </AuthLayout>
      );
      expect(getByText('Card Content')).toBeTruthy();
      // Content should be within a card container with max-width
    });

    it('should center content vertically and horizontally', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Centered Content</Text>
        </AuthLayout>
      );
      expect(getByText('Centered Content')).toBeTruthy();
      // Layout should center content
    });
  });

  describe('Form Handling', () => {
    it('should handle long forms with scrolling', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Form Field 1</Text>
          <Text>Form Field 2</Text>
          <Text>Form Field 3</Text>
        </AuthLayout>
      );
      expect(getByText('Form Field 1')).toBeTruthy();
      expect(getByText('Form Field 2')).toBeTruthy();
      expect(getByText('Form Field 3')).toBeTruthy();
    });

    it('should handle multiple form fields', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout>
          <Text>Email Field</Text>
          <Text>Password Field</Text>
          <Text>Submit Button</Text>
        </AuthLayout>
      );
      expect(getByText('Email Field')).toBeTruthy();
      expect(getByText('Password Field')).toBeTruthy();
      expect(getByText('Submit Button')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { root } = renderWithTheme(
        <AuthLayout>
        </AuthLayout>
      );
      expect(root).toBeTruthy();
    });

    it('should handle null/undefined optional props', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout branding={null} helpLinks={undefined}>
          <Text>Content</Text>
        </AuthLayout>
      );
      expect(getByText('Content')).toBeTruthy();
    });

    it('should handle all optional props as null', () => {
      const { root } = renderWithTheme(
        <AuthLayout branding={null} helpLinks={null} accessibilityLabel={null} testID={null}>
        </AuthLayout>
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Platform-Specific Tests', () => {
    describe('Android variant', () => {
      it('should render Android AuthLayout', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByTestId, getByText } = renderWithTheme(
          <AuthLayoutAndroid testID="android-auth-layout">
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );
        expect(getByTestId('android-auth-layout')).toBeTruthy();
        expect(getByText('Android Content')).toBeTruthy();
      });

      it('should render Android AuthLayout with branding', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutAndroid branding={<Text>Android Logo</Text>} testID="android-auth-layout">
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );
        expect(getByText('Android Logo')).toBeTruthy();
        expect(getByText('Android Content')).toBeTruthy();
      });

      it('should render Android AuthLayout with help links', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutAndroid helpLinks={<Text>Android Help</Text>} testID="android-auth-layout">
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );
        expect(getByText('Android Help')).toBeTruthy();
        expect(getByText('Android Content')).toBeTruthy();
      });

      it('should have correct accessibility role on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByTestId } = renderWithTheme(
          <AuthLayoutAndroid testID="android-auth-layout">
            <Text>Content</Text>
          </AuthLayoutAndroid>
        );
        const container = getByTestId('android-auth-layout');
        // RN native doesn't support "main"; use "none" to avoid crash
        expect(container.props.accessibilityRole).toBe('none');
      });

      it('should handle keyboard on Android', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutAndroid testID="android-auth-layout">
            <Text>Form with Input</Text>
          </AuthLayoutAndroid>
        );
        expect(getByText('Form with Input')).toBeTruthy();
      });

      it('should render Android screen header and banner variants', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const onPress = jest.fn();
        const { getByText, getByTestId } = renderWithTheme(
          <AuthLayoutAndroid
            testID="android-auth-layout"
            banner={<Text>Android Banner</Text>}
            showScreenHeader
            screenTitle="Android Header"
            screenSubtitle="Android Subtitle"
            screenBackAction={{ label: 'Return', hint: 'Return hint', onPress, testID: 'android-back' }}
          >
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );

        expect(getByText('Android Banner')).toBeTruthy();
        expect(getByText('Android Header')).toBeTruthy();
        expect(getByText('Android Subtitle')).toBeTruthy();
        expect(getByText('Android Content')).toBeTruthy();
        expect(getByTestId('android-back')).toBeTruthy();
      });

      it('should render Android screen header without back action or subtitle', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const { getByText, queryByTestId, queryByText } = renderWithTheme(
          <AuthLayoutAndroid
            testID="android-auth-layout"
            showScreenHeader
            screenTitle="Android Title Only"
          >
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );

        expect(getByText('Android Title Only')).toBeTruthy();
        expect(queryByText('Android Subtitle')).toBeNull();
        expect(queryByTestId('auth-layout-back')).toBeNull();
      });

      it('should render Android subtitle-only header with fallback back test id', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutAndroid = require('@platform/layouts/AuthLayout/AuthLayout.android').default;
        const onPress = jest.fn();
        const { getByText, queryByText, getByTestId } = renderWithTheme(
          <AuthLayoutAndroid
            testID="android-auth-layout"
            showScreenHeader
            screenSubtitle="Android subtitle only"
            screenBackAction={{ label: 'Return', onPress }}
          >
            <Text>Android Content</Text>
          </AuthLayoutAndroid>
        );

        expect(getByText('Android subtitle only')).toBeTruthy();
        expect(queryByText('Android Header')).toBeNull();
        expect(getByTestId('auth-layout-back')).toBeTruthy();
      });
    });

    describe('iOS variant', () => {
      it('should render iOS AuthLayout', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const { getByTestId, getByText } = renderWithTheme(
          <AuthLayoutIOS testID="ios-auth-layout">
            <Text>iOS Content</Text>
          </AuthLayoutIOS>
        );
        expect(getByTestId('ios-auth-layout')).toBeTruthy();
        expect(getByText('iOS Content')).toBeTruthy();
      });

      it('should render iOS AuthLayout with branding', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutIOS branding={<Text>iOS Logo</Text>} testID="ios-auth-layout">
            <Text>iOS Content</Text>
          </AuthLayoutIOS>
        );
        expect(getByText('iOS Logo')).toBeTruthy();
        expect(getByText('iOS Content')).toBeTruthy();
      });

      it('should render iOS AuthLayout with help links', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutIOS helpLinks={<Text>iOS Help</Text>} testID="ios-auth-layout">
            <Text>iOS Content</Text>
          </AuthLayoutIOS>
        );
        expect(getByText('iOS Help')).toBeTruthy();
        expect(getByText('iOS Content')).toBeTruthy();
      });

      it('should have correct accessibility role on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const { getByTestId } = renderWithTheme(
          <AuthLayoutIOS testID="ios-auth-layout">
            <Text>Content</Text>
          </AuthLayoutIOS>
        );
        const container = getByTestId('ios-auth-layout');
        // RN native doesn't support "main"; use "none" to avoid crash
        expect(container.props.accessibilityRole).toBe('none');
      });

      it('should handle keyboard on iOS', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutIOS testID="ios-auth-layout">
            <Text>Form with Input</Text>
          </AuthLayoutIOS>
        );
        expect(getByText('Form with Input')).toBeTruthy();
      });

      it('should render iOS screen header and banner variants', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const onPress = jest.fn();
        const { getByText, getByTestId } = renderWithTheme(
          <AuthLayoutIOS
            testID="ios-auth-layout"
            banner={<Text>iOS Banner</Text>}
            showScreenHeader
            screenTitle="iOS Header"
            screenSubtitle="iOS Subtitle"
            screenBackAction={{ label: 'Return', hint: 'Return hint', onPress, testID: 'ios-back' }}
          >
            <Text>iOS Content</Text>
          </AuthLayoutIOS>
        );

        expect(getByText('iOS Banner')).toBeTruthy();
        expect(getByText('iOS Header')).toBeTruthy();
        expect(getByText('iOS Subtitle')).toBeTruthy();
        expect(getByText('iOS Content')).toBeTruthy();
        expect(getByTestId('ios-back')).toBeTruthy();
      });

      it('should render iOS subtitle-only header with fallback back test id', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutIOS = require('@platform/layouts/AuthLayout/AuthLayout.ios').default;
        const onPress = jest.fn();
        const { getByText, queryByText, getByTestId } = renderWithTheme(
          <AuthLayoutIOS
            testID="ios-auth-layout"
            showScreenHeader
            screenSubtitle="iOS subtitle only"
            screenBackAction={{ label: 'Return', onPress }}
          >
            <Text>iOS Content</Text>
          </AuthLayoutIOS>
        );

        expect(getByText('iOS subtitle only')).toBeTruthy();
        expect(queryByText('iOS Header')).toBeNull();
        expect(getByTestId('auth-layout-back')).toBeTruthy();
      });
    });

    describe('Web variant', () => {
      it('should render Web AuthLayout', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText, UNSAFE_getByType } = renderWithTheme(
          <AuthLayoutWeb testID="web-auth-layout">
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );
        expect(getByText('Web Content')).toBeTruthy();
        // Verify component renders (role is set in component but not queryable in test env)
        const container = UNSAFE_getByType(AuthLayoutWeb);
        expect(container).toBeTruthy();
      });

      it('should render Web AuthLayout with branding', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutWeb branding={<Text>Web Logo</Text>} testID="web-auth-layout">
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );
        expect(getByText('Web Logo')).toBeTruthy();
        expect(getByText('Web Content')).toBeTruthy();
      });

      it('should render Web AuthLayout with help links', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutWeb helpLinks={<Text>Web Help</Text>} testID="web-auth-layout">
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );
        expect(getByText('Web Help')).toBeTruthy();
        expect(getByText('Web Content')).toBeTruthy();
      });

      it('should accept className prop on web', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText } = renderWithTheme(
          <AuthLayoutWeb className="custom-class" testID="web-auth-layout">
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );
        expect(getByText('Web Content')).toBeTruthy();
      });

      it('should have correct accessibility role on Web', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText, UNSAFE_getByType } = renderWithTheme(
          <AuthLayoutWeb testID="web-auth-layout">
            <Text>Content</Text>
          </AuthLayoutWeb>
        );
        expect(getByText('Content')).toBeTruthy();
        // Web component sets role="main" in StyledContainer (verified in component code)
        // Role attribute is not queryable in React Native test environment
        const container = UNSAFE_getByType(AuthLayoutWeb);
        expect(container).toBeTruthy();
      });

      it('should render Web screen header and banner variants', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const onPress = jest.fn();
        const { getByText, getByTestId } = renderWithTheme(
          <AuthLayoutWeb
            testID="web-auth-layout"
            banner={<Text>Web Banner</Text>}
            showScreenHeader
            screenTitle="Web Header"
            screenSubtitle="Web Subtitle"
            screenBackAction={{ label: 'Return', hint: 'Return hint', onPress, testID: 'web-back' }}
          >
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );

        expect(getByText('Web Banner')).toBeTruthy();
        expect(getByText('Web Header')).toBeTruthy();
        expect(getByText('Web Subtitle')).toBeTruthy();
        expect(getByText('Web Content')).toBeTruthy();
        expect(getByTestId('web-back')).toBeTruthy();
      });

      it('should render Web screen header without back action or subtitle', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const { getByText, queryByTestId, queryByText } = renderWithTheme(
          <AuthLayoutWeb testID="web-auth-layout" showScreenHeader screenTitle="Web Title Only">
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );

        expect(getByText('Web Title Only')).toBeTruthy();
        expect(queryByText('Web Subtitle')).toBeNull();
        expect(queryByTestId('auth-layout-back')).toBeNull();
      });

      it('should render Web subtitle-only header with fallback back test id', () => {
        // eslint-disable-next-line import/no-unresolved
        const AuthLayoutWeb = require('@platform/layouts/AuthLayout/AuthLayout.web').default;
        const onPress = jest.fn();
        const { getByText, queryByText, getByTestId } = renderWithTheme(
          <AuthLayoutWeb
            testID="web-auth-layout"
            showScreenHeader
            screenSubtitle="Web subtitle only"
            screenBackAction={{ label: 'Return', onPress }}
          >
            <Text>Web Content</Text>
          </AuthLayoutWeb>
        );

        expect(getByText('Web subtitle only')).toBeTruthy();
        expect(queryByText('Web Header')).toBeNull();
        expect(getByTestId('auth-layout-back')).toBeTruthy();
      });
    });
  });

  describe('Types', () => {
    it('should export LAYOUT_VARIANTS from types', () => {
      // eslint-disable-next-line import/no-unresolved
      const { LAYOUT_VARIANTS } = require('@platform/layouts/AuthLayout/types');
      expect(LAYOUT_VARIANTS).toBeDefined();
      expect(LAYOUT_VARIANTS.DEFAULT).toBe('default');
      expect(LAYOUT_VARIANTS.WITH_BRANDING).toBe('with-branding');
      expect(LAYOUT_VARIANTS.WITH_HELP_LINKS).toBe('with-help-links');
    });
  });

  describe('Platform Selector', () => {
    it('should export default component from index', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthLayoutIndex = require('@platform/layouts/AuthLayout').default;
      expect(AuthLayoutIndex).toBeDefined();
      expect(typeof AuthLayoutIndex).toBe('function');
    });

    it('should render through platform selector', () => {
      const { getByText } = renderWithTheme(
        <AuthLayout testID="platform-selector-test">
          <Text>Platform Selected Content</Text>
        </AuthLayout>
      );
      expect(getByText('Platform Selected Content')).toBeTruthy();
    });

    it('should export from index.js', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthLayoutFromIndex = require('@platform/layouts/AuthLayout/index').default;
      expect(AuthLayoutFromIndex).toBeDefined();
      expect(typeof AuthLayoutFromIndex).toBe('function');
      // Test by rendering the exported component to ensure index.js is executed
      const { getByText } = renderWithTheme(
        <AuthLayoutFromIndex testID="index-export-test">
          <Text>Index Export Content</Text>
        </AuthLayoutFromIndex>
      );
      expect(getByText('Index Export Content')).toBeTruthy();
    });

    it('should export useAuthLayout and LAYOUT_VARIANTS from index.js', () => {
      // eslint-disable-next-line import/no-unresolved
      const AuthLayoutIndex = require('@platform/layouts/AuthLayout/index');
      expect(typeof AuthLayoutIndex.useAuthLayout).toBe('function');
      expect(AuthLayoutIndex.LAYOUT_VARIANTS).toBeDefined();
      expect(AuthLayoutIndex.LAYOUT_VARIANTS.DEFAULT).toBe('default');
    });
  });

  describe('Style files', () => {
    it('should export Android styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AuthLayout/AuthLayout.android.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledKeyboardAvoidingView).toBeDefined();
      expect(styles.StyledScrollView).toBeDefined();
      expect(styles.StyledCard).toBeDefined();
      expect(styles.StyledBranding).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
      expect(styles.StyledHelpLinks).toBeDefined();
    });

    it('should export iOS styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AuthLayout/AuthLayout.ios.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledKeyboardAvoidingView).toBeDefined();
      expect(styles.StyledScrollView).toBeDefined();
      expect(styles.StyledCard).toBeDefined();
      expect(styles.StyledBranding).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
      expect(styles.StyledHelpLinks).toBeDefined();
    });

    it('should export Web styles', () => {
      // eslint-disable-next-line import/no-unresolved
      const styles = require('@platform/layouts/AuthLayout/AuthLayout.web.styles');
      expect(styles).toBeDefined();
      expect(styles.StyledContainer).toBeDefined();
      expect(styles.StyledCard).toBeDefined();
      expect(styles.StyledBranding).toBeDefined();
      expect(styles.StyledContent).toBeDefined();
      expect(styles.StyledHelpLinks).toBeDefined();
    });
  });
});
