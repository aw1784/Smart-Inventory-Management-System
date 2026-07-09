import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as statisticsService from '../services/statisticsService.js';

export const fetchSummary = createAsyncThunk('statistics/summary', () =>
  statisticsService.getSummary()
);
export const fetchOrderStats = createAsyncThunk('statistics/orders', () =>
  statisticsService.getOrderStats()
);
export const fetchUserStats = createAsyncThunk('statistics/users', () =>
  statisticsService.getUserStats()
);
export const fetchInventoryStats = createAsyncThunk('statistics/inventory', () =>
  statisticsService.getInventoryStats()
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    summary: {},
    orderStats: { total: 0, totalRevenue: 0, byStatus: {} },
    userStats: { total: 0, byRole: {} },
    inventoryStats: { items: 0, totalStock: 0, byLocation: {} },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSummary.pending, (s) => { s.loading = true; });
    b.addCase(fetchSummary.fulfilled, (s, a) => { s.loading = false; s.summary = a.payload; });
    b.addCase(fetchSummary.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(fetchOrderStats.fulfilled, (s, a) => { s.orderStats = a.payload; });
    b.addCase(fetchUserStats.fulfilled, (s, a) => { s.userStats = a.payload; });
    b.addCase(fetchInventoryStats.fulfilled, (s, a) => { s.inventoryStats = a.payload; });
  },
});

export default statisticsSlice.reducer;
