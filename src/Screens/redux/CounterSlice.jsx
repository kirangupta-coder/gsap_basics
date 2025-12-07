import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state) => {
      state.count += 5;
    },
    decreament: (state) => {
      state.count -= 5;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { increament, decreament, reset } = counterSlice.actions;

export default counterSlice.reducer;
