// userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  callState: 'hello',
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {},
});

// export const {} = callsSlice.actions;

export default callsSlice.reducer;
