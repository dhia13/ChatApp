import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import uiReducer from './Slices/uiSlice';
import contactsReducer from './Slices/contactsSlice';
import roomsReducer from './Slices/roomsSlice';
import notiReducer from './Slices/notificationsSlice';
import callsSlice from './Slices/callsSlice';
import { combineReducers } from 'redux';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  contacts: contactsReducer,
  rooms: roomsReducer,
  notifications: notiReducer,
  calls: callsSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['rooms'], // Exclude the 'rooms' slice from being persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export default store;

export const persistor = persistStore(store);
