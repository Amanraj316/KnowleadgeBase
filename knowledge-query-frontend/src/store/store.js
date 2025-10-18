// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import documentReducer from './documentSlice'; // <-- Import this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentReducer, // <-- Add this
  },
});