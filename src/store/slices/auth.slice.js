/**
 * Auth Slice
 * Global auth state (user, status, error codes)
 * File: auth.slice.js
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loadCurrentUserUseCase,
  loginUseCase,
  logoutUseCase,
  refreshSessionUseCase,
  registerUseCase,
} from '@features/auth';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errorCode: null,
  lastUpdated: null,
};

const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const user = await loginUseCase(payload);
    return user || null;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const user = await registerUseCase(payload);
    return user || null;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUseCase();
    return true;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

const refreshSession = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const tokens = await refreshSessionUseCase();
    return tokens || null;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await loadCurrentUserUseCase();
    return user || null;
  } catch (error) {
    return rejectWithValue(error?.code || 'UNKNOWN_ERROR');
  }
});

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
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = action.payload || 'UNKNOWN_ERROR';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorCode = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.lastUpdated = Date.now();
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errorCode = action.payload || 'UNKNOWN_ERROR';
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
        state.errorCode = action.payload || 'UNKNOWN_ERROR';
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
        state.errorCode = action.payload || 'UNKNOWN_ERROR';
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
        state.errorCode = action.payload || 'UNKNOWN_ERROR';
      });
  },
});

const actions = {
  ...authSlice.actions,
  login,
  register,
  logout,
  refreshSession,
  loadCurrentUser,
};
const reducer = authSlice.reducer;

export { actions, reducer };
export default { actions, reducer };
