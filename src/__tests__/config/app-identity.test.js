/**
 * App Identity Configuration Tests
 * File: app-identity.test.js
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  APP_DISPLAY_NAME,
  APP_SHORT_NAME,
  PUBLIC_APPLE_TOUCH_ICON,
  PUBLIC_FAVICON,
  PUBLIC_ICON_192,
  PUBLIC_ICON_512,
  PUBLIC_LOGO,
} from '@config/app-identity';

const toPublicAssetPath = (assetPath) =>
  path.resolve(__dirname, '../../../public', assetPath.replace(/^\//, ''));

describe('app-identity.js', () => {
  test('should export non-empty app identity labels', () => {
    expect(typeof APP_DISPLAY_NAME).toBe('string');
    expect(APP_DISPLAY_NAME.trim().length).toBeGreaterThan(0);
    expect(typeof APP_SHORT_NAME).toBe('string');
    expect(APP_SHORT_NAME.trim().length).toBeGreaterThan(0);
  });

  test('should use existing public assets for web identity icons', () => {
    const publicAssets = [
      PUBLIC_FAVICON,
      PUBLIC_ICON_192,
      PUBLIC_ICON_512,
      PUBLIC_APPLE_TOUCH_ICON,
      PUBLIC_LOGO,
    ];

    publicAssets.forEach((assetPath) => {
      expect(assetPath.startsWith('/')).toBe(true);
      expect(fs.existsSync(toPublicAssetPath(assetPath))).toBe(true);
    });
  });
});
