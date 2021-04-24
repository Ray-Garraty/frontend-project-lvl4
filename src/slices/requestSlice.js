/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { channelsSlice } from './channelsSlice.js';
import { messagesSlice } from './messagesSlice.js';

// const storage = window.localStorage;

export const requestSlice = createSlice({
  name: 'request',
  initialState: { status: 'idle', isNetworkOn: null },
  reducers: {
    onRequestPending: (state) => {
      state.status = 'sending';
    },
    onRequestSuccess: (state) => {
      state.status = 'success';
    },
    onRequestFailure: (state) => {
      state.status = 'failure';
    },
    onNetworkIsDown: (state) => {
      state.isNetworkOn = false;
    },
  },
  extraReducers: {
    [messagesSlice.actions.addMessageSuccess]: (state) => {
      state.isNetworkOn = true;
    },
    [channelsSlice.actions.addChannelSuccess]: (state) => {
      state.isNetworkOn = true;
    },
    [channelsSlice.actions.removeChannelSuccess]: (state) => {
      state.isNetworkOn = true;
    },
  },
});

export const {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  onNetworkIsDown,
} = requestSlice.actions;

export default requestSlice.reducer;
