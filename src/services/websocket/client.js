import { WS_BASE_URL } from '@config/env';
import { tokenManager } from '@security';

const MAX_RECONNECT_DELAY_MS = 30000;
const BASE_RECONNECT_DELAY_MS = 1000;
const OPEN_STATE = 1;
const CONNECTING_STATE = 0;

const listeners = new Map();
let socket = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
let disconnectRequested = false;
let connectionPromise = null;

const hasActiveSubscriptions = () =>
  Array.from(listeners.values()).some((eventListeners) => eventListeners.size > 0);

const resolveWebSocketConstructor = () => {
  if (typeof globalThis?.WebSocket === 'function') return globalThis.WebSocket;
  if (typeof WebSocket === 'function') return WebSocket;
  return null;
};

const buildSocketUrl = (baseUrl, token) => {
  try {
    const url = new URL(String(baseUrl || '').trim() || 'ws://localhost:3000');
    if (token) {
      url.searchParams.set('token', token);
    }
    return url.toString();
  } catch {
    const fallback = String(baseUrl || 'ws://localhost:3000').replace(/\/$/, '');
    if (!token) return fallback;
    const separator = fallback.includes('?') ? '&' : '?';
    return `${fallback}${separator}token=${encodeURIComponent(token)}`;
  }
};

const notifyListeners = (eventName, payload, rawMessage) => {
  const eventListeners = listeners.get(eventName);
  if (eventListeners) {
    eventListeners.forEach((handler) => {
      try {
        handler(payload, rawMessage);
      } catch {
        // Listener failures must not affect websocket flow.
      }
    });
  }

  const allListeners = listeners.get('*');
  if (allListeners) {
    allListeners.forEach((handler) => {
      try {
        handler(payload, rawMessage);
      } catch {
        // Listener failures must not affect websocket flow.
      }
    });
  }
};

const sendRaw = (message) => {
  if (!socket || socket.readyState !== OPEN_STATE) return false;
  try {
    socket.send(JSON.stringify(message));
    return true;
  } catch {
    return false;
  }
};

const scheduleReconnect = () => {
  if (disconnectRequested) return;
  if (!hasActiveSubscriptions()) return;
  if (reconnectTimer) return;

  const delay = Math.min(
    MAX_RECONNECT_DELAY_MS,
    BASE_RECONNECT_DELAY_MS * (2 ** reconnectAttempts)
  );
  reconnectAttempts += 1;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect().catch(() => {});
  }, delay);
};

const clearReconnectTimer = () => {
  if (!reconnectTimer) return;
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
};

const handleIncomingMessage = (event) => {
  let parsed;
  try {
    parsed = JSON.parse(String(event?.data || '{}'));
  } catch {
    return;
  }

  const eventName = String(parsed?.event || '').trim();
  if (!eventName) return;

  if (eventName === 'ping') {
    sendRaw({
      event: 'pong',
      payload: {
        pingId: parsed?.payload?.pingId || null,
        timestamp: Date.now()
      }
    });
    return;
  }

  notifyListeners(eventName, parsed?.payload || {}, parsed);
};

const resetSocket = () => {
  if (!socket) return;
  try {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
  } catch {
    // Ignore cleanup errors.
  }
  socket = null;
};

const connect = async () => {
  if (socket && (socket.readyState === OPEN_STATE || socket.readyState === CONNECTING_STATE)) {
    return socket;
  }
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    const WebSocketCtor = resolveWebSocketConstructor();
    if (!WebSocketCtor) return null;

    const token = await tokenManager.getAccessToken();
    if (!token) return null;

    disconnectRequested = false;
    clearReconnectTimer();
    const url = buildSocketUrl(WS_BASE_URL, token);

    return await new Promise((resolve) => {
      let settled = false;
      const ws = new WebSocketCtor(url);
      socket = ws;

      ws.onopen = () => {
        reconnectAttempts = 0;
        if (!settled) {
          settled = true;
          resolve(ws);
        }
      };

      ws.onmessage = handleIncomingMessage;

      ws.onerror = () => {
        if (!disconnectRequested) {
          scheduleReconnect();
        }
        if (!settled) {
          settled = true;
          resolve(null);
        }
      };

      ws.onclose = () => {
        resetSocket();
        if (!disconnectRequested) {
          scheduleReconnect();
        }
      };
    });
  })();

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

const disconnect = () => {
  disconnectRequested = true;
  clearReconnectTimer();
  reconnectAttempts = 0;
  if (!socket) return;
  try {
    socket.close();
  } catch {
    // Ignore close errors.
  }
  resetSocket();
};

const subscribe = (eventName, handler) => {
  const key = String(eventName || '').trim();
  if (!key || typeof handler !== 'function') {
    return () => {};
  }

  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key).add(handler);

  connect().catch(() => {});

  return () => {
    const eventListeners = listeners.get(key);
    if (!eventListeners) return;
    eventListeners.delete(handler);
    if (eventListeners.size === 0) {
      listeners.delete(key);
    }
    if (!hasActiveSubscriptions()) {
      disconnect();
    }
  };
};

const isConnected = () => Boolean(socket && socket.readyState === OPEN_STATE);

const websocketClient = {
  connect,
  disconnect,
  subscribe,
  isConnected,
};

export default websocketClient;
