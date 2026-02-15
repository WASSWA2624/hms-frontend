const fs = require('fs');
const path = require('path');

const createBabelConfig = require('../../../babel.config');

describe('Phase 000 setup compliance', () => {
  test('should include required babel module aliases with JS-only extensions', () => {
    const cache = jest.fn();
    const babelConfig = createBabelConfig({ cache });

    expect(cache).toHaveBeenCalledWith(true);

    const moduleResolverPlugin = babelConfig.plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === 'module-resolver'
    );

    expect(moduleResolverPlugin).toBeDefined();

    const resolverOptions = moduleResolverPlugin[1];
    expect(resolverOptions.extensions).toEqual(['.js', '.jsx', '.json']);

    expect(resolverOptions.alias).toMatchObject({
      '@': './src',
      '@app': './src/app',
      '@platform': './src/platform',
      '@theme': './src/theme',
      '@store': './src/store',
      '@features': './src/features',
      '@services': './src/services',
      '@offline': './src/offline',
      '@security': './src/security',
      '@hooks': './src/hooks',
      '@utils': './src/utils',
      '@config': './src/config',
      '@i18n': './src/i18n',
      '@errors': './src/errors',
      '@logging': './src/logging',
      '@bootstrap': './src/bootstrap',
      '@navigation': './src/navigation',
      '@debug': './src/debug',
    });
  });

  test('should contain required phase-0 scaffold directories', () => {
    const projectRoot = process.cwd();
    const requiredDirectories = [
      'src/workers',
      'src/accessibility',
      'src/flags',
      'src/__tests__/components',
      'src/__tests__/screens',
    ];

    requiredDirectories.forEach((directory) => {
      expect(fs.existsSync(path.join(projectRoot, directory))).toBe(true);
    });
  });
});
