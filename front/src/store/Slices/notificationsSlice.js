import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  notificationsCount: 0,
  newNotificationsCount: 0,
  unseenNotificationsCount: 0,
  isUnseen: false,
};

const notiSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.unseenNotificationsCount++;
      state.isUnseen = true;
    },
    setNotificationAlert: (state, action) => {
      state.unseenNotificationsCount = action.payload;
      state.isUnseen = true;
    },
    // Action to mark all notifications as seen
    markAllNotificationsAsSeen: (state) => {
      state.isUnseen = false;
      state.newNotificationsCount = 0;
      state.unseenNotificationsCount = 0;
    },
    // Action to clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.newNotificationsCount = 0;
      state.unseenNotificationsCount = 0;
      state.isUnseen = false;
    },
  },
});

export const {
  addNotification,
  markAllNotificationsAsSeen,
  setNotificationAlert,
} = notiSlice.actions;

export default notiSlice.reducer;
