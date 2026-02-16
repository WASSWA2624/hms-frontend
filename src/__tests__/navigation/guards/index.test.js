/**
 * Guard Infrastructure Tests (Step 7.11)
 * 
 * Verifies:
 * - Folder structure exists (src/navigation/guards/)
 * - Barrel export file exists (src/navigation/guards/index.js)
 * - Barrel export correctly exports all guards
 * 
 * Rule References:
 * - project-structure.mdc (navigation guards in src/navigation/guards/)
 * - coding-conventions.mdc (barrel exports via index.js)
 */

import fs from 'fs';
import path from 'path';
import {
  useAuthGuard,
  useRoleGuard,
  ROLE_GUARD_ERRORS,
  useRouteAccessGuard,
  ROUTE_ACCESS_GUARD_ERRORS,
} from '@navigation/guards';

describe('Step 7.11: Guard Infrastructure', () => {
  const guardsDir = path.join(__dirname, '../../../navigation/guards');
  const barrelFile = path.join(guardsDir, 'index.js');

  describe('Folder Structure', () => {
    it('should have guards directory at src/navigation/guards/', () => {
      expect(fs.existsSync(guardsDir)).toBe(true);
      expect(fs.statSync(guardsDir).isDirectory()).toBe(true);
    });

    it('should have barrel export file at src/navigation/guards/index.js', () => {
      expect(fs.existsSync(barrelFile)).toBe(true);
      expect(fs.statSync(barrelFile).isFile()).toBe(true);
    });
  });

  describe('Barrel Export', () => {
    it('should export useAuthGuard hook', () => {
      expect(typeof useAuthGuard).toBe('function');
    });

    it('should export useRoleGuard hook', () => {
      expect(typeof useRoleGuard).toBe('function');
    });

    it('should export useRouteAccessGuard hook', () => {
      expect(typeof useRouteAccessGuard).toBe('function');
    });

    it('should export ROLE_GUARD_ERRORS constants', () => {
      expect(ROLE_GUARD_ERRORS).toBeDefined();
      expect(typeof ROLE_GUARD_ERRORS).toBe('object');
      expect(ROLE_GUARD_ERRORS.NO_USER).toBe('NO_USER');
      expect(ROLE_GUARD_ERRORS.NO_ROLE).toBe('NO_ROLE');
      expect(ROLE_GUARD_ERRORS.INSUFFICIENT_ROLE).toBe('INSUFFICIENT_ROLE');
    });

    it('should export ROUTE_ACCESS_GUARD_ERRORS constants', () => {
      expect(ROUTE_ACCESS_GUARD_ERRORS).toBeDefined();
      expect(typeof ROUTE_ACCESS_GUARD_ERRORS).toBe('object');
      expect(ROUTE_ACCESS_GUARD_ERRORS.ACCESS_DENIED).toBe('ACCESS_DENIED');
    });

    it('should allow importing from @navigation/guards alias', () => {
      // Verify that the alias resolves correctly
      // This test verifies the imports at the top of the file work correctly
      // The imports are already tested above, this confirms alias resolution
      expect(useAuthGuard).toBeDefined();
      expect(useRoleGuard).toBeDefined();
      expect(useRouteAccessGuard).toBeDefined();
      expect(ROLE_GUARD_ERRORS).toBeDefined();
      expect(ROUTE_ACCESS_GUARD_ERRORS).toBeDefined();
    });
  });
});

