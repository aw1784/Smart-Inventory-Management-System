import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import productReducer from './productSlice.js';
import orderReducer from './orderSlice.js';
import inventoryReducer from './inventorySlice.js';
import statisticsReducer from './statisticsSlice.js';
import usersReducer from './usersSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    inventory: inventoryReducer,
    statistics: statisticsReducer,
    users: usersReducer,
  },
});
