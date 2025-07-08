import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("adminToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!initialToken,
    token: initialToken,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem("adminToken", action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
