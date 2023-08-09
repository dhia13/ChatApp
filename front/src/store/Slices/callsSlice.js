import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  callType: 'idle',
  to: {
    name: '',
    id: '',
    img: '',
    userName: '',
    isVideo: false,
    isAudio: false,
  },
  from: {
    name: '',
    id: '',
    img: '',
    userName: '',
  },
  callState: '',
  type: 'video',
  state: 'idle',
  isAudio: false,
  isVideo: false,
  useMedia: false,
  signal: null,
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    initCall: (state, action) => {
      state.callType = 'outGoing';
      state.to = action.payload.to;
      state.useMedia = true;
      state.callState = 'trying to connect';
    },
    setReceive: (state, action) => {
      state.callType = 'incoming';
      state.from = action.payload.from;
      state.type = action.payload.type;
      state.useMedia = true;
      state.callState = 'pending';
      state.signal = action.payload.signal;
    },
    callAccepted: (state) => {
      state.callState = 'connected';
    },
    isRinging: (state) => {
      state.callState = 'ringing';
    },
    terminateCall: (state) => {
      return initialState;
    },
  },
});

export const { initCall, setReceive, callAccepted, isRinging, terminateCall } =
  callsSlice.actions;

export default callsSlice.reducer;
