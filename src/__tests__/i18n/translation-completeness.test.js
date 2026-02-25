const fs = require('fs');
const path = require('path');

const FRONTEND_ROOT = path.resolve(__dirname, '..', '..', '..');
const SOURCE_ROOT = path.join(FRONTEND_ROOT, 'src');
const LOCALE_PATH = path.join(SOURCE_ROOT, 'i18n', 'locales', 'en.json');

const LITERAL_TRANSLATION_KEY_REGEX = /\bt\s*\(\s*['"]([^'"]+)['"]/g;
const SOURCE_FILE_REGEX = /\.(js|jsx|ts|tsx)$/i;
const DYNAMIC_KEY_WHITELIST = [
  /^navigation\.items\.main\.<id>$/,
  /^navigation\.items\.patient\.<id>$/,
];

const shouldSkipDirectory = (name) =>
  name === 'node_modules' || name === '__tests__' || name.startsWith('.');

const collectSourceFiles = (directory) => {
  const output = [];
  const stack = [directory];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!shouldSkipDirectory(entry.name)) {
          stack.push(fullPath);
        }
        return;
      }
      if (SOURCE_FILE_REGEX.test(entry.name)) {
        output.push(fullPath);
      }
    });
  }

  return output;
};

const getTranslationValue = (dictionary, keyPath) => {
  if (!dictionary || typeof dictionary !== 'object') return undefined;
  if (!keyPath || typeof keyPath !== 'string') return undefined;

  const segments = keyPath.split('.');
  let current = dictionary;

  for (let index = 0; index < segments.length; index += 1) {
    if (!current || typeof current !== 'object') return undefined;

    const remainingPath = segments.slice(index).join('.');
    if (Object.prototype.hasOwnProperty.call(current, remainingPath)) {
      return current[remainingPath];
    }

    const key = segments[index];
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      return undefined;
    }

    current = current[key];
  }

  return current;
};

const collectLiteralTranslationKeys = (sourceFiles) => {
  const keys = new Set();

  sourceFiles.forEach((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    let match = LITERAL_TRANSLATION_KEY_REGEX.exec(source);
    while (match) {
      const key = String(match[1] || '').trim();
      if (key) keys.add(key);
      match = LITERAL_TRANSLATION_KEY_REGEX.exec(source);
    }
    LITERAL_TRANSLATION_KEY_REGEX.lastIndex = 0;
  });

  return Array.from(keys).sort();
};

const collectEmptyStringKeys = (node, basePath = '', output = []) => {
  if (typeof node === 'string') {
    if (!node.trim()) output.push(basePath);
    return output;
  }
  if (!node || typeof node !== 'object') return output;

  Object.entries(node).forEach(([key, value]) => {
    const nextPath = basePath ? `${basePath}.${key}` : key;
    collectEmptyStringKeys(value, nextPath, output);
  });

  return output;
};

describe('translation completeness', () => {
  const localeDictionary = JSON.parse(fs.readFileSync(LOCALE_PATH, 'utf8'));
  const sourceFiles = collectSourceFiles(SOURCE_ROOT);
  const literalKeys = collectLiteralTranslationKeys(sourceFiles);

  test('has values for all literal translation keys used in src', () => {
    const missingKeys = literalKeys.filter((key) => {
      if (DYNAMIC_KEY_WHITELIST.some((pattern) => pattern.test(key))) return false;
      return getTranslationValue(localeDictionary, key) === undefined;
    });

    expect(missingKeys).toEqual([]);
  });

  test('does not contain empty translation strings in en locale', () => {
    const emptyKeys = collectEmptyStringKeys(localeDictionary).sort();
    expect(emptyKeys).toEqual([]);
  });
});
