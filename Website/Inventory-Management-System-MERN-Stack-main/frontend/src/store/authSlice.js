import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService.js';
import { saveAuth, loadAuth, clearAuth } from '../utils/storage.js';

const initial = loadAuth();

export const signInUser = createAsyncThunk('auth/signIn', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.signIn(payload);
    saveAuth(data.token, data.user);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign-in failed');
  }
});

export const signUpUser = createAsyncThunk('auth/signUp', async (payload, { rejectWithValue }) => {
  try {
    const data = await authService.signUp(payload);
    saveAuth(data.token, data.user);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign-up failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: initial.token, user: initial.user, loading: false, error: null },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(signInUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(signInUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(signUpUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(signUpUser.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(signUpUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
