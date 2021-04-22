/* eslint-disable no-param-reassign */
import { mapValues } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || {
  authState: {
    status: 'logged out',
    activeUser: {
      status: null,
      username: null,
      token: null,
    },
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authState.status = 'logged out';
      state.authState.activeUser = mapValues(state.authState.activeUser, () => null);
      storage.setItem('state', JSON.stringify(state));
    },
    setUserStatus: (state, action) => {
      state.authState.activeUser.status = action.payload;
      storage.setItem('state', JSON.stringify(state));
    },
    login: (state, action) => {
      state.authState.status = 'logged in';
      state.authState.activeUser = action.payload;
      storage.setItem('state', JSON.stringify(state));
    },
  },
});

export const {
  login,
  logout,
  setUserStatus,
} = authSlice.actions;

export default authSlice.reducer;
