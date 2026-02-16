/**
 * Onboarding Route Group
 * File: onboarding-route-group.test.js
 */
import fs from 'fs';
import path from 'path';

describe('Onboarding Route Group', () => {
  const appDir = path.join(__dirname, '../../app');
  const onboardingGroupDir = path.join(appDir, '(onboarding)');
  const authGroupDir = path.join(appDir, '(auth)');

  test('(onboarding) route group is present', () => {
    expect(fs.existsSync(onboardingGroupDir)).toBe(true);
  });

  test('contains required onboarding routes for tier 1 flows', () => {
    const files = fs.readdirSync(onboardingGroupDir);
    const requiredRoutes = [
      '_layout.jsx',
      'resume.jsx',
      'provisioning.jsx',
      'welcome.jsx',
      'checklist.jsx',
      'modules.jsx',
      'trial.jsx',
      'upgrade.jsx',
      'plan.jsx',
      'billing-cycle.jsx',
      'payment.jsx',
      'payment-success.jsx',
    ];
    requiredRoutes.forEach((routeFile) => {
      expect(files).toContain(routeFile);
    });
  });

  test('contains resume-link-sent route in auth group', () => {
    const authFiles = fs.readdirSync(authGroupDir);
    expect(authFiles).toContain('resume-link-sent.jsx');
  });
});
