import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  currentRoomId: '',
};

export const fetchRecentRooms = createAsyncThunk('room/fetch', async () => {
  try {
    const response = await api.get('/rooms', { withCredentials: true });
    return response.data.rooms;
  } catch (error) {
    throw Error('Failed to fetch recent rooms');
  }
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.currentRoomId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentRooms.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentRooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
