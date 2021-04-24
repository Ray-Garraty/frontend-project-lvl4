/* eslint-disable no-param-reassign */
import { mapValues } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'logged out',
  activeUser: {
    status: null,
    username: null,
    token: null,
  },
};

export const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = 'logged out';
      state.activeUser = mapValues(state.activeUser, () => null);
    },
    setUserStatus: (state, action) => {
      state.activeUser.status = action.payload;
    },
    login: (state, action) => {
      state.status = 'logged in';
      state.activeUser = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setUserStatus,
} = authSlice.actions;

export default authSlice.reducer;
