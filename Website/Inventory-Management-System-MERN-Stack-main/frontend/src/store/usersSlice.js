import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../services/userService.js';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await userService.listUsers(); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to load users'); }
  }
);

export const changeUserRole = createAsyncThunk(
  'users/changeRole',
  async ({ id, role }, { rejectWithValue }) => {
    try { return await userService.updateUserRole(id, role); }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to change role'); }
  }
);

export const removeUser = createAsyncThunk(
  'users/remove',
  async (id, { rejectWithValue }) => {
    try { await userService.deleteUser(id); return id; }
    catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete user'); }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null },
  reducers: { clearUsersError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending,   (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchUsers.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });

    b.addCase(changeUserRole.fulfilled, (s, a) => {
      const idx = s.items.findIndex((u) => u._id === a.payload._id);
      if (idx >= 0) s.items[idx] = a.payload;
    });
    b.addCase(changeUserRole.rejected, (s, a) => { s.error = a.payload; });

    b.addCase(removeUser.fulfilled, (s, a) => {
      s.items = s.items.filter((u) => u._id !== a.payload);
    });
    b.addCase(removeUser.rejected, (s, a) => { s.error = a.payload; });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
