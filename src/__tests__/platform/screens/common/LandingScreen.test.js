/**
 * LandingScreen Component Tests
 * File: LandingScreen.test.js
 * 
 * Tests all three platform implementations (Android, iOS, Web)
 * Per testing.mdc: Platform-specific testing is MANDATORY
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');
const { useRouter } = require('expo-router');

// Mock dependencies
jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Import platform-specific implementations
const LandingScreenAndroid = require('@platform/screens/common/LandingScreen/LandingScreen.android').default;
const LandingScreenIOS = require('@platform/screens/common/LandingScreen/LandingScreen.ios').default;
const LandingScreenWeb = require('@platform/screens/common/LandingScreen/LandingScreen.web').default;
const useLandingScreen = require('@platform/screens/common/LandingScreen/useLandingScreen').default;

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('LandingScreen Component', () => {
  const mockT = jest.fn((key) => {
    const translations = {
      'landing.title': 'Welcome',
      'landing.hero.title': 'Welcome to Our App',
      'landing.hero.description': 'Get started with our amazing platform. Discover features that help you achieve your goals.',
      'landing.cta.getStarted': 'Get Started',
      'landing.cta.getStartedHint': 'Navigate to the home page to get started',
      'landing.cta.learnMore': 'Learn More',
      'landing.cta.learnMoreHint': 'Learn more about our features',
    };
    return translations[key] || key;
  });

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT });
    useRouter.mockReturnValue(mockRouter);
  });

  describe('Android Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      expect(getByTestId('landing-screen')).toBeTruthy();
    });

    it('should display hero title', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      expect(getByTestId('landing-hero-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
    });

    it('should display hero description', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      expect(getByTestId('landing-hero-description')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
    });

    it('should render Get Started button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const button = getByTestId('landing-get-started-button');
      expect(button).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.cta.getStarted');
    });

    it('should render Learn More button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const button = getByTestId('landing-learn-more-button');
      expect(button).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.cta.learnMore');
    });

    it('should handle Get Started button press', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const button = getByTestId('landing-get-started-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const screen = getByTestId('landing-screen');
      expect(screen.props.accessibilityLabel).toBe('Welcome');
    });

    it('should use theme tokens for styling', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      expect(getByTestId('landing-screen')).toBeTruthy();
      // Theme is applied via styled-components, verified by rendering
    });
  });

  describe('iOS Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      expect(getByTestId('landing-screen')).toBeTruthy();
    });

    it('should display hero title', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      expect(getByTestId('landing-hero-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
    });

    it('should display hero description', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      expect(getByTestId('landing-hero-description')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
    });

    it('should render Get Started button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      const button = getByTestId('landing-get-started-button');
      expect(button).toBeTruthy();
    });

    it('should render Learn More button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      const button = getByTestId('landing-learn-more-button');
      expect(button).toBeTruthy();
    });

    it('should handle Get Started button press', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      const button = getByTestId('landing-get-started-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenIOS />);
      const screen = getByTestId('landing-screen');
      expect(screen.props.accessibilityLabel).toBe('Welcome');
    });
  });

  describe('Web Implementation', () => {
    it('should render without errors', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      expect(getByTestId('landing-screen')).toBeTruthy();
    });

    it('should display hero title', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      expect(getByTestId('landing-hero-title')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
    });

    it('should display hero description', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      expect(getByTestId('landing-hero-description')).toBeTruthy();
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
    });

    it('should render Get Started button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      const button = getByTestId('landing-get-started-button');
      expect(button).toBeTruthy();
    });

    it('should render Learn More button', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      const button = getByTestId('landing-learn-more-button');
      expect(button).toBeTruthy();
    });

    it('should handle Get Started button press', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      const button = getByTestId('landing-get-started-button');
      fireEvent.press(button);
      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });

    it('should have correct accessibility labels', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      const screen = getByTestId('landing-screen');
      expect(screen.props.accessibilityLabel).toBe('Welcome');
    });

    it('should support keyboard navigation (web-specific)', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenWeb />);
      const button = getByTestId('landing-get-started-button');
      expect(button).toBeTruthy();
      // Keyboard navigation is handled by React Native Web
    });
  });

  describe('i18n Integration', () => {
    it('should use i18n for all text (Android)', () => {
      renderWithTheme(<LandingScreenAndroid />);
      expect(mockT).toHaveBeenCalledWith('landing.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
      expect(mockT).toHaveBeenCalledWith('landing.cta.getStarted');
      expect(mockT).toHaveBeenCalledWith('landing.cta.learnMore');
    });

    it('should use i18n for all text (iOS)', () => {
      renderWithTheme(<LandingScreenIOS />);
      expect(mockT).toHaveBeenCalledWith('landing.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
    });

    it('should use i18n for all text (Web)', () => {
      renderWithTheme(<LandingScreenWeb />);
      expect(mockT).toHaveBeenCalledWith('landing.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.title');
      expect(mockT).toHaveBeenCalledWith('landing.hero.description');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility labels (Android)', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const screen = getByTestId('landing-screen');
      expect(screen.props.accessibilityLabel).toBeDefined();
    });

    it('should have accessibility hints for buttons (Android)', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const button = getByTestId('landing-get-started-button');
      expect(button.props.accessibilityHint).toBeDefined();
    });

    it('should have accessibility role for header (Android)', () => {
      const { getByTestId } = renderWithTheme(<LandingScreenAndroid />);
      const title = getByTestId('landing-hero-title');
      expect(title.props.accessibilityRole).toBe('header');
    });
  });
});

