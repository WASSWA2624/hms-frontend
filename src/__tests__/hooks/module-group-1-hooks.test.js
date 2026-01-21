/**
 * Module Group 1 Hooks Tests
 * File: module-group-1-hooks.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@store/rootReducer';
import {
  useAuth,
  useUserSession,
  useTenant,
  useFacility,
  useBranch,
  useDepartment,
  useUnit,
  useRoom,
  useWard,
  useBed,
  useAddress,
  useContact,
  useUser,
  useUserProfile,
  useRole,
  usePermission,
  useRolePermission,
  useUserRole,
  useApiKey,
  useApiKeyPermission,
  useUserMfa,
  useOauthAccount,
} from '@hooks';

const HookConsumer = () => {
  useAuth();
  useUserSession();
  useTenant();
  useFacility();
  useBranch();
  useDepartment();
  useUnit();
  useRoom();
  useWard();
  useBed();
  useAddress();
  useContact();
  useUser();
  useUserProfile();
  useRole();
  usePermission();
  useRolePermission();
  useUserRole();
  useApiKey();
  useApiKeyPermission();
  useUserMfa();
  useOauthAccount();
  return null;
};

describe('module group 1 hooks', () => {
  it('renders all hooks without crashing', () => {
    const store = configureStore({ reducer: rootReducer });
    const tree = (
      <Provider store={store}>
        <HookConsumer />
      </Provider>
    );
    expect(() => render(tree)).not.toThrow();
  });
});
