// userSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const initialState = {
  contactsList: [],
  contactsCount: 0,
  loading: false,
  error: false,
  onlineUsers: [],
  requests: {
    loading: false,
    error: false,
    requests: [],
    requestsCount: 0,
    unseenRequests: false,
    lastFetchedTimestamp: null,
    sentRequestTo: [],
  },
  invites: {
    invites: [],
    loading: false,
    error: false,
    invitesCount: 0,
    unseenInvites: false,
    unseenInvitesCount: 0,
    lastFetchedTimestamp: null,
    invitesFrom: [],
  },
};
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    try {
      const response = await api.get('/contactsList', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);
export const fetchContactsWitouLoading = createAsyncThunk(
  'contacts/fetchContactsWitouLoading',
  async () => {
    try {
      const response = await api.get('/contactsList', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);
export const fetchInvites = createAsyncThunk(
  'contacts/fetchInvites',
  async () => {
    try {
      const response = await api.get('/invitesList', {
        withCredentials: true,
      });
      return response.data.invites;
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);
export const fetchRequests = createAsyncThunk(
  'contacts/fetchRequests',
  async () => {
    try {
      const response = await api.get('/requestsList', {
        withCredentials: true,
      });
      const sentRequestTo = response.data.requests.map((request) => {
        return request.receiver.id;
      });
      return { requests: response.data.requests, sentRequestTo: sentRequestTo };
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);
// ongoing
export const sendRequest = createAsyncThunk(
  'contacts/sendRequest',
  async (id) => {
    try {
      const response = await api.post(
        '/request',
        { receiver: id },
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);
export const removeRequest = createAsyncThunk(
  'contacts/removeRequest',
  async (id) => {
    try {
      const response = await api.delete(`/request/${id}`, {
        withCredentials: true,
      });
      return response.data.contacts;
    } catch (error) {
      throw Error('Failed to fetch contacts');
    }
  }
);

export const setLastFetchedTimestamp = (timestamp) => ({
  type: 'contacts/setLastFetchedTimestamp',
  payload: timestamp,
});
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    newInvite: (state, action) => {
      state.invites.unseenInvitesCount += 1;
      state.invites.unseenInvites = true;
    },
    setLastFetchedTimestamp: (state, action) => {
      state.invites.lastFetchedTimestamp = action.payload;
    },
    markInviteAsSeen: (state, action) => {
      state.invites.unseenInvitesCount = 0;
      state.invites.unseenInvites = false;
    },
    setInvitesAlert: (state, action) => {
      state.invites.unseenInvitesCount = action.payload;
      state.invites.unseenInvites = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsList = action.payload.contacts;
        state.contactsCount = action.payload.contacts.length;
        state.onlineUsers = action.payload.onlineUsers;
        state.error = null;
      })
      .addCase(fetchContactsWitouLoading.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsList = action.payload.contacts;
        state.contactsCount = action.payload.contacts.length;
        state.onlineUsers = action.payload.onlineUsers;
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.requests.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests.loading = false;
        state.requests.requests = action.payload.requests;
        state.requests.sentRequestTo = action.payload.sentRequestTo;
        state.requests.requestsCount = action.payload.length;
        state.requests.error = null;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.requests.loading = false;
        state.requests.error = action.error.message;
      })
      // fetch invites
      .addCase(fetchInvites.pending, (state) => {
        state.invites.loading = true;
      })
      .addCase(fetchInvites.fulfilled, (state, action) => {
        state.invites.loading = false;
        state.invites.invites = action.payload;
        state.invites.invitesCount = action.payload.length;
        state.invites.error = null;
      })
      .addCase(fetchInvites.rejected, (state, action) => {
        state.invites.loading = false;
        state.invites.error = action.error.message;
      });
  },
});

export const { setOnlineUsers, newInvite, markInviteAsSeen, setInvitesAlert } =
  contactsSlice.actions;

export default contactsSlice.reducer;
