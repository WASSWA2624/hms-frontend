/**
 * Stack Component Tests
 * File: Stack.test.js
 */

const React = require('react');
const { Text } = require('react-native');
const { render } = require('@testing-library/react-native');
const { ThemeProvider: NativeThemeProvider } = require('styled-components/native');
const { ThemeProvider: WebThemeProvider } = require('styled-components');
const lightThemeModule = require('@theme/light.theme');

const lightTheme = lightThemeModule.default || lightThemeModule;

const StackModule = require('@platform/components/layout/Stack');
const Stack = StackModule.default || StackModule;

// eslint-disable-next-line import/no-unresolved
const StackAndroid = require('@platform/components/layout/Stack/Stack.android').default;
// eslint-disable-next-line import/no-unresolved
const StackIOS = require('@platform/components/layout/Stack/Stack.ios').default;
// eslint-disable-next-line import/no-unresolved
const StackWeb = require('@platform/components/layout/Stack/Stack.web').default;

const { useStack } = require('@platform/components/layout/Stack/useStack');
const {
  DIRECTIONS,
  SPACING,
  ALIGN,
  JUSTIFY,
} = require('@platform/components/layout/Stack/types');

const renderNativeWithTheme = (component) => {
  return render(
    <NativeThemeProvider theme={lightTheme}>{component}</NativeThemeProvider>
  );
};

const renderWebWithTheme = (component) => {
  return render(<WebThemeProvider theme={lightTheme}>{component}</WebThemeProvider>);
};

describe('Stack Component', () => {
  describe('Basic Rendering', () => {
    it('should render default stack from barrel export', () => {
      const { getByText } = renderNativeWithTheme(
        <Stack>
          <Text>Stack Child</Text>
        </Stack>
      );

      expect(getByText('Stack Child')).toBeTruthy();
    });

    it('should render with testID', () => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack testID="stack-test" />
      );

      expect(getByTestId('stack-test')).toBeTruthy();
    });
  });

  describe('Direction', () => {
    it('should support vertical direction', () => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack testID="stack-vertical" direction={DIRECTIONS.VERTICAL} />
      );

      expect(getByTestId('stack-vertical')).toBeTruthy();
    });

    it('should support horizontal direction', () => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack testID="stack-horizontal" direction={DIRECTIONS.HORIZONTAL} />
      );

      expect(getByTestId('stack-horizontal')).toBeTruthy();
    });

    it('should normalize invalid direction to vertical', () => {
      const normalized = useStack({ direction: 'invalid' });
      expect(normalized.direction).toBe(DIRECTIONS.VERTICAL);
    });
  });

  describe('Spacing', () => {
    it.each([
      [SPACING.XS],
      [SPACING.SM],
      [SPACING.MD],
      [SPACING.LG],
      [SPACING.XL],
      [SPACING.XXL],
    ])('should support spacing token %s', (spacing) => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack testID={`stack-${spacing}`} spacing={spacing} />
      );

      expect(getByTestId(`stack-${spacing}`)).toBeTruthy();
    });

    it('should normalize invalid spacing to md', () => {
      const normalized = useStack({ spacing: 'invalid' });
      expect(normalized.spacing).toBe(SPACING.MD);
    });
  });

  describe('Layout Props', () => {
    it('should support align, justify, and wrap props', () => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack
          testID="stack-layout"
          align={ALIGN.CENTER}
          justify={JUSTIFY.BETWEEN}
          wrap
        />
      );

      const stack = getByTestId('stack-layout');
      expect(stack).toBeTruthy();
      expect(stack.props.align).toBe(ALIGN.CENTER);
      expect(stack.props.justify).toBe(JUSTIFY.BETWEEN);
      expect(stack.props.wrap).toBe(true);
    });

    it('should coerce wrap to boolean', () => {
      const normalized = useStack({ wrap: 'truthy' });
      expect(normalized.wrap).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should pass accessibility label on native', () => {
      const { getByTestId } = renderNativeWithTheme(
        <Stack testID="stack-a11y" accessibilityLabel="Stack container" />
      );

      const stack = getByTestId('stack-a11y');
      expect(stack.props.accessibilityLabel).toBe('Stack container');
    });
  });

  describe('Platform Implementations', () => {
    it('should render Android implementation', () => {
      const { getByTestId } = renderNativeWithTheme(
        <StackAndroid testID="stack-android" />
      );

      expect(getByTestId('stack-android')).toBeTruthy();
    });

    it('should render iOS implementation', () => {
      const { getByTestId } = renderNativeWithTheme(
        <StackIOS testID="stack-ios" />
      );

      expect(getByTestId('stack-ios')).toBeTruthy();
    });

    it('should render Web implementation', () => {
      const { getByLabelText } = renderWebWithTheme(
        <StackWeb testID="stack-web" accessibilityLabel="Web stack" />
      );

      const stack = getByLabelText('Web stack');
      expect(stack).toBeTruthy();
      expect(stack.props['data-testid']).toBe('stack-web');
    });
  });

  describe('Shared Entry and Exports', () => {
    it('should export shared component entry file', () => {
      // eslint-disable-next-line import/no-unresolved
      const sharedModule = require('@platform/components/layout/Stack/Stack');
      const SharedStack = sharedModule.default || sharedModule;

      const { getByLabelText } = renderWebWithTheme(
        <SharedStack testID="shared-stack" accessibilityLabel="Shared stack" />
      );

      expect(getByLabelText('Shared stack')).toBeTruthy();
    });

    it('should export constants from types', () => {
      expect(DIRECTIONS.VERTICAL).toBe('vertical');
      expect(DIRECTIONS.HORIZONTAL).toBe('horizontal');
      expect(SPACING.XS).toBe('xs');
      expect(SPACING.MD).toBe('md');
      expect(ALIGN.CENTER).toBe('center');
      expect(JUSTIFY.BETWEEN).toBe('space-between');
    });
  });
});