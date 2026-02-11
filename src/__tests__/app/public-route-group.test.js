import fs from 'fs';
import path from 'path';

describe('Public Route Group Structure', () => {
  const appDir = path.join(__dirname, '../../app');
  const publicGroupDir = path.join(appDir, '(public)');

  test('should have (public) route group directory', () => {
    expect(fs.existsSync(publicGroupDir)).toBe(true);
  });

  test('should include required landing route files', () => {
    expect(fs.existsSync(path.join(publicGroupDir, '_layout.jsx'))).toBe(true);
    expect(fs.existsSync(path.join(publicGroupDir, 'landing.jsx'))).toBe(true);
  });
});

