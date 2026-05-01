import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as inventoryService from '../services/inventoryService.js';

export const fetchInventory = createAsyncThunk('inventory/fetch', () =>
  inventoryService.listInventory()
);
export const addInventoryItem = createAsyncThunk('inventory/add', (payload) =>
  inventoryService.addInventory(payload)
);
export const adjustInventoryItem = createAsyncThunk('inventory/adjust', ({ id, delta }) =>
  inventoryService.adjustInventory(id, delta)
);
export const removeInventoryItem = createAsyncThunk('inventory/remove', async (id) => {
  await inventoryService.removeInventory(id);
  return id;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchInventory.pending, (s) => { s.loading = true; });
    b.addCase(fetchInventory.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchInventory.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(addInventoryItem.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(adjustInventoryItem.fulfilled, (s, a) => {
      const idx = s.items.findIndex((i) => i._id === a.payload._id);
      if (idx >= 0) s.items[idx] = a.payload;
    });
    b.addCase(removeInventoryItem.fulfilled, (s, a) => {
      s.items = s.items.filter((i) => i._id !== a.payload);
    });
  },
});

export default inventorySlice.reducer;
