/**
 * Network Slice
 * Tracks network connectivity state
 * File: network.slice.js
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: true,
  isSyncing: false,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
  },
});

const actions = networkSlice.actions;
const reducer = networkSlice.reducer;

export { actions, reducer };
export default { actions, reducer };

