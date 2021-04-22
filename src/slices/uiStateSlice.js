/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || {
  uiState: {
    signupForm: {
      userAlreadyExists: false,
    },
    dropDownMenu: {
      channelId: null,
    },
  },
};

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    makeSignupUserFormInvalid: (state) => {
      state.uiState.signupForm.userAlreadyExists = true;
    },
    toggleChannelDropDownMenu: (state, action) => {
      const id = action.payload || null;
      if (state.uiState.dropDownMenu.channelId === id) {
        state.uiState.dropDownMenu.channelId = null;
      } else {
        state.uiState.dropDownMenu.channelId = id;
      }
      storage.setItem('state', JSON.stringify(state));
    },
  },
});

export const {
  makeSignupUserFormInvalid,
  toggleChannelDropDownMenu,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
