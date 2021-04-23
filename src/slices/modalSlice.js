/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || {
  uiState: {
    modalWindow: {
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
    dropDownMenu: {
      channelId: null,
    },
  },
};

export const modalSlice = createSlice({
  name: 'modalWindowsState',
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.uiState.modalWindow.addChannel.isOpened = true;
      storage.setItem('state', JSON.stringify(state));
    },
    openRemoveModal: (state, action) => {
      const id = action.payload;
      state.uiState.modalWindow.removeChannel.isOpened = true;
      state.uiState.modalWindow.removeChannel.id = id;
      storage.setItem('state', JSON.stringify(state));
    },
    openRenameModal: (state, action) => {
      const id = action.payload;
      state.uiState.modalWindow.renameChannel.isOpened = true;
      state.uiState.modalWindow.renameChannel.id = id;
      storage.setItem('state', JSON.stringify(state));
    },
    closeModalWindow: (state) => {
      state.uiState.modalWindow.addChannel.isOpened = false;
      state.uiState.modalWindow.removeChannel.isOpened = false;
      state.uiState.modalWindow.renameChannel.isOpened = false;
      storage.setItem('state', JSON.stringify(state));
    },
  },
});

export const {
  openAddModal,
  openRemoveModal,
  openRenameModal,
  closeModalWindow,
} = modalSlice.actions;

export default modalSlice.reducer;
