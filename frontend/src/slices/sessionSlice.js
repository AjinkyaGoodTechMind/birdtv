import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    sessionUser: {},
    domains: [],
    currentDomain: {},
    error: "",
  },
  reducers: {
    setSessionUser: (state, action) => {
      const { payload } = action;
      state.sessionUser = payload.user;
      state.domains = payload.domains;
      state.currentDomain = payload.domains[0];
    },
    setCurrentDomain: (state, action) => {
      const { payload } = action;

      state.currentDomain = payload;
    },
    setNewDomain: (state, action) => {
      const { payload } = action;
      state.domains.push(payload);
      state.currentDomain = payload;
    },
    clearSession: (state) => {
      state.sessionUser = [];
      state.domains = [];
      state.currentDomain = {};
    },
  },
});

// Export Actions
export const { setSessionUser, setCurrentDomain, setNewDomain, clearSession } = sessionSlice.actions;

// Export Reducer
export default sessionSlice.reducer;
