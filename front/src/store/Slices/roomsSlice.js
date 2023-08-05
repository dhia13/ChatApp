import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  currentRoomId: '',
  newMsg: {},
  messagesToSeen: [],
};

export const fetchRecentRooms = createAsyncThunk('room/fetch', async (id) => {
  try {
    const response = await api.get('/rooms', { withCredentials: true });
    let rooms = response.data.rooms;
    // rooms.map((r) => {
    //   let isFirst = false;
    //   console.log({ usersOrder1: r.users[0]._id, owner: id });
    //   if (r.users[0]._id === id) {
    //     isFirst = true;
    //   }
    //   if (isFirst && r.seen[1] === true) {
    //     if (r.seen[1] === true) {
    //       r.seen = true;
    //     } else {
    //       r.seen = false;
    //     }
    //   } else {
    //     if (r.seen[0] === true) {
    //       r.seen = true;
    //     } else {
    //       r.seen = false;
    //     }
    //   }
    //   return r;
    // });
    return rooms;
  } catch (error) {
    throw Error('Failed to fetch recent rooms');
  }
});
export const fetchRecentRoomsWitoutLoading = createAsyncThunk(
  'roomWithoutLoading/fetch',
  async (id) => {
    try {
      const response = await api.get('/rooms', { withCredentials: true });
      let rooms = response.data.rooms;
      // console.log({ reswinoutLoad: response.data.rooms });
      // rooms.map((r) => {
      //   let isFirst = false;
      //   if (r.users[0].id === id) {
      //     isFirst = true;
      //   }
      //   console.log({ r });
      //   console.log({ isFirst });
      //   if (isFirst && r.seen[1] === true) {
      //     if (r.seen[1] === true) {
      //       r.seen = true;
      //     } else {
      //       r.seen = false;
      //     }
      //   } else {
      //     if (r.seen[0] === true) {
      //       r.seen = true;
      //     } else {
      //       r.seen = false;
      //     }
      //   }
      //   return r;
      // });
      return rooms;
    } catch (error) {
      throw Error('Failed to fetch recent rooms');
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.currentRoomId = action.payload;
    },
    setNewMsg: (state, action) => {
      state.newMsg = action.payload;
    },
    setMessagesToSeen: (state, action) => {
      state.messagesToSeen = action.payload;
    },
    cleanSeenMessages: (state, action) => {
      state.messagesToSeen = [];
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
      .addCase(fetchRecentRoomsWitoutLoading.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentRooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setRoom, setNewMsg, setMessagesToSeen, cleanSeenMessages } =
  roomsSlice.actions;

export default roomsSlice.reducer;
