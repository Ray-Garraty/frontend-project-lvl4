/* eslint-disable no-param-reassign */
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
    error: null,
    addChannel: {
      isOpened: false,
      error: null,
      input: {
        isValid: true,
      },
    },
    removeChannel: {
      isOpened: false,
      id: null,
    },
    renameChannel: {
      isOpened: false,
      id: null,
    },
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
    openAddModal: (state) => {
      state.modalWindow.addChannel.isOpened = true;
    },
    openRemoveModal: (state, action) => {
      const id = action.payload;
      state.modalWindow.removeChannel.isOpened = true;
      state.modalWindow.removeChannel.id = id;
    },
    openRenameModal: (state, action) => {
      const id = action.payload;
      state.modalWindow.renameChannel.isOpened = true;
      state.modalWindow.renameChannel.id = id;
    },
    closeModalWindow: (state) => {
      state.modalWindow.addChannel.isOpened = false;
      state.modalWindow.removeChannel.isOpened = false;
      state.modalWindow.renameChannel.isOpened = false;
    },
  },
});

export const {
  activateChannel,
  toggleSigninFormStatus,
  openAddModal,
  openRemoveModal,
  openRenameModal,
  closeModalWindow,
  makeSignupUserFormInvalid,
  toggleChannelDropDownMenu,
} = uiStateSlice.actions;

export default uiStateSlice.reducer;
