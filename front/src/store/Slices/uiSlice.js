// userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menu: true,
  isRecent: true,
  addChat: false,
  addContact: false,
  userMenu: false,
  currentChat: false,
  editContacts: false,
  notifications: false,
  invites: false,
  current: 'chat',
  second: 'profile',
};

const uiSloce = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu: (state, action) => {
      state.menu = !state.menu;
      state.addChat = false;
      state.addContact = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
      state.invites = false;
    },
    setCurrent: (state, action) => {
      state.current = action.payload.current;
      state.second = action.payload.second;
    },
    resetSettings: (state, action) => {
      state.addChat = false;
      state.addContact = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
      state.invites = false;
    },
    toggleIsRecent: (state, action) => {
      state.isRecent = action.payload;
    },
    toggleAddChat: (state, action) => {
      state.addChat = !state.addChat;
      state.addContact = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
      state.invites = false;
    },
    toggleAddContact: (state, action) => {
      state.addContact = !state.addContact;
      state.addChat = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
      state.invites = false;
    },
    toggleUserMenu: (state, action) => {
      state.userMenu = !state.userMenu;
      state.addChat = false;
      state.addContact = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
      state.invites = false;
    },
    toggleEditContacts: (state, action) => {
      state.editContacts = !state.editContacts;
    },
    toggleNotifications: (state, action) => {
      state.notifications = !state.notifications;
      state.addChat = false;
      state.addContact = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.invites = false;
    },
    toggleInvites: (state, action) => {
      state.invites = !state.invites;
      state.addChat = false;
      state.addContact = false;
      state.userMenu = false;
      state.currentChat = false;
      state.editContacts = false;
      state.notifications = false;
    },
  },
});

export const {
  toggleMenu,
  toggleIsRecent,
  toggleAddChat,
  toggleAddContact,
  toggleUserMenu,
  toggleEditContacts,
  toggleNotifications,
  toggleInvites,
  resetSettings,
  setCurrent,
} = uiSloce.actions;

export default uiSloce.reducer;
