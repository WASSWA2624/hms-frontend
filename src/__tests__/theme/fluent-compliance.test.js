/**
 * Microsoft Fluent Design Compliance Tests
 * File: fluent-compliance.test.js
 * P009 Step 9.8: Verify tokens and styling match Fluent (primary blue, neutrals, typography, radius, elevation).
 * Rule Reference: theme-design.mdc
 */

const getCjsOrEsmDefault = (mod) => mod?.default ?? mod;

describe('Microsoft Fluent Design Compliance (P009 Step 9.8)', () => {
  describe('Colors', () => {
    it('should use Fluent blue primary (#0078D4-style)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.colors.primary).toBe('#0078D4');
    });

    it('should have semantic neutrals (background, text)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.colors.background).toEqual(
        expect.objectContaining({
          primary: expect.any(String),
          secondary: expect.any(String),
          tertiary: expect.any(String),
        })
      );
      expect(lightTheme.colors.text).toEqual(
        expect.objectContaining({
          primary: expect.any(String),
          secondary: expect.any(String),
          tertiary: expect.any(String),
        })
      );
    });

    it('should have semantic success, warning, error', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.colors.success).toEqual(expect.any(String));
      expect(lightTheme.colors.warning).toEqual(expect.any(String));
      expect(lightTheme.colors.error).toEqual(expect.any(String));
    });

    it('should expose semantic surface and border token groups', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.colors.surface).toEqual(
        expect.objectContaining({
          primary: expect.any(String),
          secondary: expect.any(String),
          tertiary: expect.any(String),
        })
      );
      expect(lightTheme.colors.border).toEqual(
        expect.objectContaining({
          light: expect.any(String),
          medium: expect.any(String),
          strong: expect.any(String),
        })
      );
    });
  });

  describe('Radius (2–4px typical per theme-design.mdc)', () => {
    it('should have small radius tokens in 2–4px range for typical Fluent corners', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      const { radius } = lightTheme;
      expect(radius.xs).toBeGreaterThanOrEqual(2);
      expect(radius.xs).toBeLessThanOrEqual(4);
      expect(radius.sm).toBeGreaterThanOrEqual(2);
      expect(radius.sm).toBeLessThanOrEqual(4);
    });
  });

  describe('Elevation (light shadows per theme-design.mdc)', () => {
    it('should have light shadow tokens (sm, md)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.shadows.sm).toEqual(
        expect.objectContaining({
          shadowColor: expect.any(String),
          shadowOpacity: expect.any(Number),
          elevation: expect.any(Number),
        })
      );
      expect(lightTheme.shadows.md).toEqual(
        expect.objectContaining({
          shadowColor: expect.any(String),
          shadowOpacity: expect.any(Number),
          elevation: expect.any(Number),
        })
      );
    });

    it('should use restrained elevation (no heavy skeuomorphism)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.shadows.sm.elevation).toBeLessThanOrEqual(4);
      expect(lightTheme.shadows.md.elevation).toBeLessThanOrEqual(8);
      expect(lightTheme.shadows.sm.shadowOpacity).toBeLessThanOrEqual(0.2);
      expect(lightTheme.shadows.md.shadowOpacity).toBeLessThanOrEqual(0.25);
    });
  });

  describe('Typography (Segoe UI–style hierarchy)', () => {
    it('should expose typography tokens (font, size, weight)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.typography.fontFamily).toBeDefined();
      expect(lightTheme.typography.fontSize).toEqual(
        expect.objectContaining({
          xs: expect.any(Number),
          sm: expect.any(Number),
          md: expect.any(Number),
          lg: expect.any(Number),
        })
      );
      expect(lightTheme.typography.fontWeight).toBeDefined();
    });
  });

  describe('Breakpoints (mobile, tablet, desktop, large)', () => {
    it('should match P009 requirements: 320px+, 768px+, 1024px+, 1440px+', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      expect(lightTheme.breakpoints.mobile).toBe(320);
      expect(lightTheme.breakpoints.tablet).toBe(768);
      expect(lightTheme.breakpoints.desktop).toBe(1024);
      expect(lightTheme.breakpoints.large).toBe(1440);
    });
  });

  describe('Dark theme parity', () => {
    it('should have identical token shape for dark theme (Fluent applies to both)', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));
      expect(Object.keys(darkTheme).sort()).toEqual(Object.keys(lightTheme).sort());
      expect(darkTheme.colors.primary).toBe('#0078D4');
      expect(darkTheme.breakpoints.mobile).toBe(320);
      expect(darkTheme.radius.sm).toBe(lightTheme.radius.sm);
    });

    it('should preserve surface and border token structure in dark mode', () => {
      const lightTheme = getCjsOrEsmDefault(require('@theme/light.theme'));
      const darkTheme = getCjsOrEsmDefault(require('@theme/dark.theme'));
      expect(Object.keys(darkTheme.colors.surface).sort()).toEqual(
        Object.keys(lightTheme.colors.surface).sort()
      );
      expect(Object.keys(darkTheme.colors.border).sort()).toEqual(
        Object.keys(lightTheme.colors.border).sort()
      );
    });
  });
});
