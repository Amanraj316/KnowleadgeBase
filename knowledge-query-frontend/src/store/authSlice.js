import { createSlice } from '@reduxjs/toolkit';

// Check local storage for an existing token
const userToken = localStorage.getItem('userToken') || null;

const initialState = {
  userToken, // The JWT token
  isLoggedIn: !!userToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set credentials on login
    setCredentials(state, action) {
      const { token } = action.payload;
      state.userToken = token;
      state.isLoggedIn = true;
      localStorage.setItem('userToken', token);
    },
    // Action to clear credentials on logout
    logout(state) {
      state.userToken = null;
      state.isLoggedIn = false;
      localStorage.removeItem('userToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;