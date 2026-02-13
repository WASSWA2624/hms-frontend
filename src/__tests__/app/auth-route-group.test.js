/**
 * Auth Route Group
 * File: auth-route-group.test.js
 */
import fs from 'fs';
import path from 'path';

describe('Auth Route Group', () => {
  const appDir = path.join(__dirname, '../../app');
  const authGroupDir = path.join(appDir, '(auth)');

  test('(auth) route group is present', () => {
    expect(fs.existsSync(authGroupDir)).toBe(true);
  });

  test('contains required auth routes for tier 2 shell flows', () => {
    const files = fs.readdirSync(authGroupDir);
    const requiredRoutes = [
      '_layout.jsx',
      'login.jsx',
      'forgot-password.jsx',
      'reset-password.jsx',
      'verify-email.jsx',
      'verify-phone.jsx',
      'tenant-selection.jsx',
      'facility-selection.jsx',
    ];
    requiredRoutes.forEach((routeFile) => {
      expect(files).toContain(routeFile);
    });
  });
});
