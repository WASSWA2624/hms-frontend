/**
 * Auth Slice
 * Global auth state (user, status, error codes)
 * File: auth.slice.js
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleError } from '@errors';
import {
  changePasswordUseCase,
  forgotPasswordUseCase,
  identifyUseCase,
  loadCurrentUserUseCase,
  loginUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  registerUseCase,
  resendVerificationUseCase,
  resetPasswordUseCase,
  verifyEmailUseCase,
  verifyPhoneUseCase,
} from '@features/auth';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errorCode: null,
  lastUpdated: null,
};

const normalizeErrorCode = (payload) =>
  (typeof payload === 'object' && payload?.code != null
    ? payload.code
    : payload) || 'UNKNOWN_ERROR';

const toRejectedAuthError = (error, context, fallbackMessage) => {
  const normalized = handleError(error, context);
  return {
    code: normalized.code || 'UNKNOWN_ERROR',
    message: normalized.safeMessage || normalized.message || fallbackMessage,
    status: typeof error?.status === 'number' ? error.status : 500,
  };
};

const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await loginUseCase(payload);
      return user || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'login' },
          'Login failed'
        )
      );
    }
  }
);

const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await registerUseCase(payload);
      if (
        result &&
        typeof result === 'object' &&
        ('user' in result || 'hasSession' in result)
      ) {
        return {
          user: result.user || null,
          hasSession: Boolean(result.hasSession),
          verification: result.verification || null,
        };
      }
      return {
        user: result || null,
        hasSession: false,
        verification: null,
      };
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'register' },
          'Registration failed'
        )
      );
    }
  }
);

const identify = createAsyncThunk(
  'auth/identify',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await identifyUseCase(payload);
      return result || { users: [] };
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'identify' },
          'Identify failed'
        )
      );
    }
  }
);

const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUseCase();
      return true;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'logout' },
          'Logout failed'
        )
      );
    }
  }
);

const refreshSession = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const tokens = await refreshSessionUseCase();
      return tokens || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'refreshSession' },
          'Session refresh failed'
        )
      );
    }
  }
);

const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await loadCurrentUserUseCase();
      return user || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'loadCurrentUser' },
          'Failed to load user'
        )
      );
    }
  }
);

const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await verifyEmailUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'verifyEmail' },
          'Email verification failed'
        )
      );
    }
  }
);

const verifyPhone = createAsyncThunk(
  'auth/verifyPhone',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await verifyPhoneUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'verifyPhone' },
          'Phone verification failed'
        )
      );
    }
  }
);

const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await resendVerificationUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'resendVerification' },
          'Resend verification failed'
        )
      );
    }
  }
);

const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await forgotPasswordUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'forgotPassword' },
          'Password reset request failed'
        )
      );
    }
  }
);

const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await resetPasswordUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'resetPassword' },
          'Password reset failed'
        )
      );
    }
  }
);

const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await changePasswordUseCase(payload);
      return result || null;
    } catch (error) {
      return rejectWithValue(
        toRejectedAuthError(
          error,
          { scope: 'store.auth', op: 'changePassword' },
          'Password change failed'
        )
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errorCode = null;
    },
    clearAuthError: (state) => {
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const payload = action.payload;
        const requiresFacilitySelection = Boolean(
          payload?.requiresFacilitySelection
        );
        state.isLoading = false;
        state.user = requiresFacilitySelection ? null : payload || null;
        state.isAuthenticated = Boolean(
          !requiresFacilitySelection && payload?.id
        );
        state.lastUpdated = Date.now();
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.isLoading = false;
        state.user = payload.user || null;
        state.isAuthenticated = Boolean(payload.hasSession);
        state.lastUpdated = Date.now();
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(identify.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(identify.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(identify.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.lastUpdated = Date.now();
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.errorCode = normalizeErrorCode(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(refreshSession.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(refreshSession.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.lastUpdated = Date.now();
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(verifyPhone.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(verifyPhone.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = normalizeErrorCode(action.payload);
      });
  },
});

const actions = {
  ...authSlice.actions,
  login,
  register,
  identify,
  logout,
  refreshSession,
  loadCurrentUser,
  verifyEmail,
  verifyPhone,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};
const reducer = authSlice.reducer;

export { actions, reducer };
export default { actions, reducer };
