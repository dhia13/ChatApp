// userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  username: '',
  email: '',
  img: '',
  id: '',
  birthday: '',
  gender: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.img = action.payload.img;
      state.gender = action.payload.gender;
      state.id = action.payload.id;
      state.birthday = action.payload.birthday;
      state.confirmenEmail = action.payload.confirmenEmail;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.username = '';
      state.email = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
