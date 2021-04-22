/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || { requestStatus: 'idle' };

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    onRequestPending: (state) => {
      state.requestStatus = 'sending';
      storage.setItem('state', JSON.stringify(state));
    },
    onRequestSuccess: (state) => {
      state.requestStatus = 'success';
      storage.setItem('state', JSON.stringify(state));
    },
    onRequestFailure: (state) => {
      state.requestStatus = 'failure';
      storage.setItem('state', JSON.stringify(state));
    },
  },
});

export const {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
} = requestSlice.actions;

export default requestSlice.reducer;
