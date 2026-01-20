/**
 * Jest NativeModules Mock
 * Ensures NativeModules.default exists before jest-expo setup runs
 * File: test/mocks/NativeModules.js
 */
const NativeModules = {
  NativeUnimoduleProxy: {
    viewManagersMetadata: {},
  },
  UIManager: {},
};

module.exports = {
  __esModule: true,
  default: NativeModules,
};


