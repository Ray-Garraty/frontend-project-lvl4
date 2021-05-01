/* eslint-disable no-param-reassign */
import { get } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentChannelId: null,
  signinForm: {
    isInvalid: false,
  },
  signupForm: {
    userAlreadyExists: false,
  },
  dropDownMenu: {
    channelId: null,
  },
  modalWindow: {
    type: null,
    isOpened: false,
    channelId: null,
  },
};

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    activateChannel: (state, action) => {
      const id = action.payload;
      state.currentChannelId = id;
    },
    toggleSigninFormStatus: (state) => {
      state.signinForm.isInvalid = !state.signinForm.isInvalid;
    },
    makeSignupUserFormInvalid: (state) => {
      state.signupForm.userAlreadyExists = true;
    },
    toggleChannelDropDownMenu: (state, action) => {
      const id = action.payload || null;
      if (state.dropDownMenu.channelId === id) {
        state.dropDownMenu.channelId = null;
      } else {
        state.dropDownMenu.channelId = id;
      }
    },
    openModalWindow: (state, action) => {
      const { type } = action.payload;
      const channelId = get(action.payload, 'channelId', null);
      return { ...state, modalWindow: { type, isOpened: true, channelId } };
    },
    closeModalWindow: (state) => ({
      ...state,
      modalWindow: { type: null, isOpened: false, channelId: null },
    }),
  },
});

export const {
  activateChannel,
  toggleSigninFormStatus,
  openModalWindow,
  closeModalWindow,
  makeSignupUserFormInvalid,
  toggleChannelDropDownMenu,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
