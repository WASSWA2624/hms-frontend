/**
 * Network Listener
 * Monitors network connectivity
 * File: network.listener.js
 */
import NetInfo from '@react-native-community/netinfo';
import { logger } from '@logging';

let isOnline = true;
let listeners = new Set();
let netInfoUnsubscribe = null;

const normalizeIsOnline = (state) => Boolean(state?.isConnected);

const notify = () => {
  listeners.forEach((listener) => {
    try {
      listener(isOnline);
    } catch {
      // Listener errors must not break the global connectivity observer.
    }
  });
};

const applyState = (state) => {
  const nextIsOnline = normalizeIsOnline(state);
  const wasOnline = isOnline;
  isOnline = nextIsOnline;

  if (wasOnline !== nextIsOnline) {
    logger.info('Network status changed', { isOnline });
    notify();
  }

  return isOnline;
};

/**
 * Fetch current connectivity from NetInfo and update internal state.
 * Notifies subscribers only when the online status changes.
 */
export const checkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return applyState(state);
};

/**
 * Subscribe to online-status changes.
 * Returns an unsubscribe function.
 */
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Start listening to NetInfo changes.
 * Idempotent: subsequent calls return the same unsubscribe function.
 */
export const startListening = () => {
  if (netInfoUnsubscribe) return netInfoUnsubscribe;

  netInfoUnsubscribe = NetInfo.addEventListener((state) => {
    applyState(state);
  });

  return netInfoUnsubscribe;
};

export const stopListening = () => {
  if (!netInfoUnsubscribe) return;
  try {
    netInfoUnsubscribe();
  } finally {
    netInfoUnsubscribe = null;
  }
};

export const getIsOnline = () => isOnline;

/**
 * Testing-only reset helper to avoid state leaking across unit tests.
 * @private
 */
export const __unsafeResetForTests = () => {
  stopListening();
  isOnline = true;
  listeners = new Set();
};

export default {
  checkConnectivity,
  subscribe,
  startListening,
  stopListening,
  getIsOnline,
};

