import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserData = createAsyncThunk("user/get-user-data", async () => {
  try {
    const { data } = await axios.get("/api/user/get-user-data");
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

export const userSlice = createSlice({
  name: "userData",
  initialState: {
    cart: [],
    orders: [],
    loading: false,
    error: "",
  },
  reducers: {
    setUserData: (state, action) => {
      const { payload } = action;

      state.cart.push(payload.cart);
      state.orders.push(payload.orders);
    },
  },

  extraReducers: {
    [getUserData.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getUserData.fulfilled]: (state, { payload }) => {
      state.cart = payload.cart;
      state.orders = payload.orders;
      state.loading = false;
    },
    [getUserData.rejected]: (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    },
  },
});

// Export Actions
export const { setUserData } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
