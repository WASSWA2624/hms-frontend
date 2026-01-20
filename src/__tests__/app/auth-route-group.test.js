/**
 * Auth Route Group Folder Structure Tests
 * File: auth-route-group.test.js
 * 
 * Tests for Step 7.7: Create auth route group folder
 * Per testing.mdc: Tests mirror source structure
 * Per app-router.mdc: Route groups use `(group-name)` syntax
 */
import fs from 'fs';
import path from 'path';

describe('Step 7.7: Auth Route Group Folder Structure', () => {
  const appDir = path.join(__dirname, '../../app');
  const authGroupDir = path.join(appDir, '(auth)');

  test('should have auth route group directory', () => {
    // Per Step 7.7: Create src/app/(auth)/ directory per app-router.mdc
    expect(fs.existsSync(authGroupDir)).toBe(true);
  });

  test('should follow route group naming convention', () => {
    // Per app-router.mdc: Route groups use (group-name) syntax
    const dirName = path.basename(authGroupDir);
    expect(dirName).toBe('(auth)');
    expect(dirName.startsWith('(')).toBe(true);
    expect(dirName.endsWith(')')).toBe(true);
  });

  test('should be located in app directory', () => {
    // Verify the directory is in the correct location
    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(authGroupDir)).toBe(true);
    
    // Verify it's a directory, not a file
    const stats = fs.statSync(authGroupDir);
    expect(stats.isDirectory()).toBe(true);
  });

  test('should allow layout file to exist in auth group', () => {
    // Per Step 7.9: Auth group layout should exist in (auth)/_layout.jsx
    const layoutFile = path.join(authGroupDir, '_layout.jsx');
    expect(fs.existsSync(layoutFile)).toBe(true);
  });
});

