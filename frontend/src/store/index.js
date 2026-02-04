import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customerSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
  },
});
