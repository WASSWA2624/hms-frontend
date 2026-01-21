/**
 * Auth Slice Tests
 * File: auth.slice.test.js
 */
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@features/auth', () => ({
  loginUseCase: jest.fn(),
  registerUseCase: jest.fn(),
  logoutUseCase: jest.fn(),
  refreshSessionUseCase: jest.fn(),
  loadCurrentUserUseCase: jest.fn(),
}));

import { actions, reducer } from '@store/slices/auth.slice';
import {
  loginUseCase,
  registerUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  loadCurrentUserUseCase,
} from '@features/auth';

const createStore = () =>
  configureStore({
    reducer: {
      auth: reducer,
    },
  });

describe('auth.slice', () => {
  beforeEach(() => {
    loginUseCase.mockResolvedValue({ id: '1' });
    registerUseCase.mockResolvedValue({ id: '2' });
    logoutUseCase.mockResolvedValue(true);
    refreshSessionUseCase.mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
    loadCurrentUserUseCase.mockResolvedValue({ id: '3' });
  });

  it('handles login/register/logout flows', async () => {
    const store = createStore();
    await store.dispatch(actions.login({ email: 'user', password: 'pass' }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
    await store.dispatch(actions.register({ email: 'user' }));
    expect(store.getState().auth.user).toEqual({ id: '2' });
    await store.dispatch(actions.logout());
    expect(store.getState().auth.user).toBeNull();
  });

  it('handles refresh and load current user', async () => {
    const store = createStore();
    await store.dispatch(actions.refreshSession());
    expect(store.getState().auth.isAuthenticated).toBe(true);
    await store.dispatch(actions.loadCurrentUser());
    expect(store.getState().auth.user).toEqual({ id: '3' });
  });

  it('stores error codes on failures', async () => {
    const store = createStore();
    loginUseCase.mockRejectedValueOnce({ code: 'UNAUTHORIZED' });
    await store.dispatch(actions.login({ email: 'user', password: 'pass' }));
    expect(store.getState().auth.errorCode).toBe('UNAUTHORIZED');
  });

  it('clears auth state', () => {
    const state = reducer(
      { user: { id: '1' }, isAuthenticated: true, isLoading: false, errorCode: 'ERROR', lastUpdated: null },
      actions.clearAuth()
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    const clearedError = reducer(state, actions.clearAuthError());
    expect(clearedError.errorCode).toBeNull();
  });
});
