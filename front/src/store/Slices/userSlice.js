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
  isLogged: false,
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
      state.isLogged = true;
    },
    clearUser: (state) => {
      state.name = '';
      state.username = '';
      state.email = '';
      state.img = '';
      state.id = '';
      state.birthday = '';
      state.gender = '';
      state.isLogged = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
