import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productService from '../services/productService.js';

export const fetchProducts = createAsyncThunk('products/fetch', () =>
  productService.listProducts()
);
export const addProduct = createAsyncThunk('products/add', (payload) =>
  productService.createProduct(payload)
);
export const removeProduct = createAsyncThunk('products/remove', async (id) => {
  await productService.deleteProduct(id);
  return id;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => { s.loading = true; });
    b.addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(addProduct.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(removeProduct.fulfilled, (s, a) => {
      s.items = s.items.filter((p) => p._id !== a.payload);
    });
  },
});

export default productSlice.reducer;
