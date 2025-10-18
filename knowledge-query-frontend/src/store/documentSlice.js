// src/store/documentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// This is an "async thunk" for fetching documents from the backend
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: {
        'x-auth-token': auth.userToken,
      },
    };
    const response = await axios.get('http://localhost:5001/api/documents', config);
    return response.data;
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default documentSlice.reducer;