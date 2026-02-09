/**
 * confirmAction
 * Safe cross-platform confirm helper (web uses window.confirm, native falls back to true).
 * File: confirmAction.js
 */

const confirmAction = (message) => {
  if (typeof globalThis !== 'undefined' && typeof globalThis.confirm === 'function') {
    return globalThis.confirm(message);
  }
  return true;
};

export { confirmAction };
