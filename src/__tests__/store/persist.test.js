/**
 * Store Persist Tests
 * File: persist.test.js
 */
import { createPersistedReducer } from '@store/persist';
import { persistReducer } from 'redux-persist';

jest.mock('redux-persist', () => ({
  persistReducer: jest.fn(),
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
});
