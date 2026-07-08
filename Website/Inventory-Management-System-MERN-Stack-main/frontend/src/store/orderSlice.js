import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../services/orderService.js';

export const fetchOrders = createAsyncThunk('orders/fetch', () => orderService.listOrders());
export const placeNewOrder = createAsyncThunk('orders/place', (payload) =>
  orderService.placeOrder(payload)
);
export const changeOrderStatus = createAsyncThunk('orders/status', ({ id, status }) =>
  orderService.updateOrderStatus(id, status)
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOrders.pending, (s) => { s.loading = true; });
    b.addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchOrders.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(placeNewOrder.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(changeOrderStatus.fulfilled, (s, a) => {
      const idx = s.items.findIndex((o) => o._id === a.payload._id);
      if (idx >= 0) s.items[idx] = a.payload;
    });
  },
});

export default orderSlice.reducer;
