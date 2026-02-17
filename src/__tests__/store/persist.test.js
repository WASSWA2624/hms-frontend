/**
 * Store Persist Tests
 * File: persist.test.js
 */
import { createPersistedReducer, uiStateTransform } from '@store/persist';
import { persistReducer } from 'redux-persist';

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn(),
  createTransform: jest.fn((inbound, outbound) => ({
    in: inbound,
    out: outbound,
  })),
}));

describe('store/persist', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('wraps reducer with persist config', () => {
    const reducer = jest.fn();
    const persisted = jest.fn();
    persistReducer.mockReturnValue(persisted);

    const result = createPersistedReducer(reducer);

    expect(persistReducer).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'root',
        whitelist: ['ui'],
        transforms: expect.arrayContaining([uiStateTransform]),
        storage: expect.objectContaining({
          getItem: expect.any(Function),
          setItem: expect.any(Function),
          removeItem: expect.any(Function),
        }),
      }),
      reducer
    );
    expect(result).toBe(persisted);
  });

  it('persists only stable ui preference fields', () => {
    const inboundState = {
      theme: 'dark',
      locale: 'fr',
      isLoading: true,
      user: { id: '1' },
      isAuthenticated: true,
      isHeaderHidden: true,
    };

    const transformed = uiStateTransform.in(inboundState, 'ui');
    expect(transformed).toEqual({
      theme: 'dark',
      locale: 'fr',
    });
  });

  it('normalizes invalid ui preferences when persisting', () => {
    const transformed = uiStateTransform.in(
      {
        theme: 'system',
        locale: '   ',
      },
      'ui'
    );

    expect(transformed).toEqual({
      theme: 'light',
    });
  });
});
