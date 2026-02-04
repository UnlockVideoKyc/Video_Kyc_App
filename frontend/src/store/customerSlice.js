import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeCustomer: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setActiveCustomer: (state, action) => {
      state.activeCustomer = action.payload;
      console.log("Active customer set in Redux:", state.activeCustomer);
    },
    clearActiveCustomer: (state) => {
      state.activeCustomer = null;
    },
  },
});

export const { setActiveCustomer, clearActiveCustomer } =
  customerSlice.actions;

export default customerSlice.reducer;
