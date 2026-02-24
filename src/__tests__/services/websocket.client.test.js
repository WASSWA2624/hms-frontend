const flushAsync = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

class MockWebSocket {
  static instances = [];

  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.sent = [];
    this.closed = false;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    MockWebSocket.instances.push(this);
  }

  send(message) {
    this.sent.push(message);
  }

  close() {
    this.closed = true;
    this.readyState = 3;
    if (typeof this.onclose === 'function') {
      this.onclose();
    }
  }

  emitOpen() {
    this.readyState = 1;
    if (typeof this.onopen === 'function') {
      this.onopen();
    }
  }

  emitMessage(payload) {
    if (typeof this.onmessage === 'function') {
      this.onmessage({ data: JSON.stringify(payload) });
    }
  }

  emitClose() {
    this.readyState = 3;
    if (typeof this.onclose === 'function') {
      this.onclose();
    }
  }
}

describe('websocket client', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    MockWebSocket.instances = [];
    global.WebSocket = MockWebSocket;

    jest.doMock('@config/env', () => ({
      WS_BASE_URL: 'ws://localhost:3000',
    }));
    jest.doMock('@security', () => ({
      tokenManager: {
        getAccessToken: jest.fn().mockResolvedValue('access-token-123'),
      },
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.WebSocket;
  });

  it('connects using tokenized websocket URL and delivers subscribed events', async () => {
    const handler = jest.fn();
    const websocketClient = require('@services/websocket/client').default;

    websocketClient.subscribe('notification.created', handler);
    await flushAsync();

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toContain('ws://localhost:3000');
    expect(MockWebSocket.instances[0].url).toContain('token=access-token-123');

    MockWebSocket.instances[0].emitOpen();
    MockWebSocket.instances[0].emitMessage({
      event: 'notification.created',
      payload: { id: 'notification-1' },
    });

    expect(handler).toHaveBeenCalledWith(
      { id: 'notification-1' },
      expect.objectContaining({ event: 'notification.created' })
    );
  });

  it('responds to ping heartbeat with app-level pong', async () => {
    const websocketClient = require('@services/websocket/client').default;

    websocketClient.subscribe('notification.created', jest.fn());
    await flushAsync();

    const socket = MockWebSocket.instances[0];
    socket.emitOpen();
    socket.emitMessage({
      event: 'ping',
      payload: { pingId: 'ping-1' },
    });

    expect(socket.sent).toHaveLength(1);
    expect(JSON.parse(socket.sent[0])).toEqual(
      expect.objectContaining({
        event: 'pong',
        payload: expect.objectContaining({
          pingId: 'ping-1',
        }),
      })
    );
  });

  it('reconnects after close while subscriptions are active', async () => {
    const websocketClient = require('@services/websocket/client').default;

    websocketClient.subscribe('opd.flow.updated', jest.fn());
    await flushAsync();

    const firstSocket = MockWebSocket.instances[0];
    firstSocket.emitOpen();
    await flushAsync();
    firstSocket.emitClose();

    expect(MockWebSocket.instances).toHaveLength(1);
    jest.advanceTimersByTime(1000);
    await flushAsync();

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('disconnects websocket when final subscriber unsubscribes', async () => {
    const websocketClient = require('@services/websocket/client').default;

    const unsubscribe = websocketClient.subscribe('opd.flow.updated', jest.fn());
    await flushAsync();

    const socket = MockWebSocket.instances[0];
    socket.emitOpen();
    unsubscribe();

    expect(socket.closed).toBe(true);
    expect(websocketClient.isConnected()).toBe(false);
  });
});
