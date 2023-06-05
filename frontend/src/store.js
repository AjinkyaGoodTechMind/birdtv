import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import sessionSlice from "./slices/sessionSlice";

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    sessionSlice: sessionSlice,
  },
});

export default store;
