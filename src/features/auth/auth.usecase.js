/**
 * Auth Use Cases
 * File: auth.usecase.js
 */
import { handleError } from '@errors';
import { tokenManager } from '@security';
import { normalizeAuthResponse } from './auth.model';
import {
  changePasswordApi,
  forgotPasswordApi,
  getCurrentUserApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
  resendVerificationApi,
  resetPasswordApi,
  verifyEmailApi,
  verifyPhoneApi,
} from './auth.api';
import { parseAuthPayload, parseCredentials } from './auth.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const loginUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseCredentials(payload);
    const response = await loginApi(parsed);
    const { user, tokens } = normalizeAuthResponse(response.data);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    }
    return user;
  });

const registerUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await registerApi(parsed);
    const { user, tokens } = normalizeAuthResponse(response.data);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    }
    return user;
  });

const logoutUseCase = async () =>
  execute(async () => {
    try {
      await logoutApi();
      return true;
    } finally {
      await tokenManager.clearTokens();
    }
  });

const refreshSessionUseCase = async () =>
  execute(async () => {
    const refreshToken = await tokenManager.getRefreshToken();
    const response = await refreshApi({ refreshToken });
    const { tokens } = normalizeAuthResponse(response.data);
    if (tokens?.accessToken && tokens?.refreshToken) {
      await tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    }
    return tokens;
  });

const loadCurrentUserUseCase = async () =>
  execute(async () => {
    const response = await getCurrentUserApi();
    const { user } = normalizeAuthResponse(response.data);
    return user;
  });

const verifyEmailUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await verifyEmailApi(parsed);
    return response.data || null;
  });

const verifyPhoneUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await verifyPhoneApi(parsed);
    return response.data || null;
  });

const resendVerificationUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await resendVerificationApi(parsed);
    return response.data || null;
  });

const forgotPasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await forgotPasswordApi(parsed);
    return response.data || null;
  });

const resetPasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await resetPasswordApi(parsed);
    return response.data || null;
  });

const changePasswordUseCase = async (payload) =>
  execute(async () => {
    const parsed = parseAuthPayload(payload);
    const response = await changePasswordApi(parsed);
    return response.data || null;
  });

export {
  loginUseCase,
  registerUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  loadCurrentUserUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
  resendVerificationUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePasswordUseCase,
};
