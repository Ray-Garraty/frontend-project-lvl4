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

const uiStateSlice = createSlice({
  name: 'uiState',
  initialState,
  reducers: {
    activateChannel: (state, action) => {
      const id = action.payload;
      return { ...state, currentChannelId: id };
    },
    toggleSigninFormStatus: (state) => {
      const isInvalid = !state.signinForm.isInvalid;
      return { ...state, signinForm: { isInvalid: !isInvalid } };
    },
    makeSignupUserFormInvalid: (state) => ({ ...state, signupForm: { userAlreadyExists: true } }),
    toggleChannelDropDownMenu: (state, action) => {
      const id = action.payload;
      const newValue = state.dropDownMenu.channelId === id ? null : id;
      return { ...state, dropDownMenu: { channelId: newValue } };
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

export const { actions } = uiStateSlice;

export default uiStateSlice.reducer;
