/* eslint-disable no-param-reassign */
import { mapValues, uniq, isNil } from 'lodash';
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
  requestStatus: 'idle',
  isNetworkOn: true,
  currentChannelId: null,
  uiState: {
    signupForm: {
      userAlreadyExists: false,
    },
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
  channels: {
    byId: [],
    allIds: [],
  },
  messages: {
    byId: [],
    allIds: [],
  },
};

export const chatSlice = createSlice({
  name: 'chat',
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
    setInitialChannels: (state, action) => {
      // console.log('payload на входе в редуктор setInitialChannels: ', action.payload);
      const { currentChannelId, channels, messages } = action.payload;
      const channelsById = {};
      channels.forEach((channel) => {
        const { id } = channel;
        channel.messagesIds = [];
        channelsById[id] = channel;
      });
      const allChannelIds = Object.keys(channelsById).sort((a, b) => a - b);
      const messagesById = {};
      messages.forEach((msg) => {
        const { id, message: { username, text, channelId } } = msg;
        messagesById[id] = { username, text, channelId };
        channelsById[channelId].messagesIds = [...channelsById[channelId].messagesIds, id];
      });
      const allMessagesIds = Object.keys(messagesById).sort((a, b) => a - b);
      state.currentChannelId = currentChannelId;
      state.channels.byId = channelsById;
      state.channels.allIds = allChannelIds;
      state.messages.byId = messagesById;
      state.messages.allIds = allMessagesIds;
      storage.setItem('state', JSON.stringify(state));
    },
    makeSignupUserFormInvalid: (state) => {
      state.uiState.signupForm.userAlreadyExists = true;
    },
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
    addMessageSuccess: (state, action) => {
      try {
        state.isNetworkOn = true;
        const { id, message } = action.payload;
        // console.log('Данные, пришедшие в редуктор addMessageSuccess: ', action.payload);
        const { channelId } = message;
        const channelMessagesIds = state.channels.byId[channelId].messagesIds;
        state.channels.byId[channelId].messagesIds = [...channelMessagesIds, id];
        state.messages.byId[id] = { ...message, id };
        state.messages.allIds = uniq([...state.messages.allIds, id]);
        storage.setItem('state', JSON.stringify(state));
      } catch (e) {
        console.log(e);
      }
    },
    addMessageFailure: (state) => {
      state.isNetworkOn = false;
      storage.setItem('state', JSON.stringify(state));
    },
    activateChannel: (state, action) => {
      const id = action.payload;
      state.currentChannelId = id;
      storage.setItem('state', JSON.stringify(state));
    },
    addChannelSuccess: (state, action) => {
      state.isNetworkOn = true;
      const channel = { ...action.payload, messagesIds: [] };
      const { id } = channel;
      state.channels.byId[id] = channel;
      if (!state.channels.allIds.includes(id.toString())) {
        state.channels.allIds = [...state.channels.allIds, id.toString()];
      }
      storage.setItem('state', JSON.stringify(state));
    },
    addChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
      storage.setItem('state', JSON.stringify(state));
    },
    removeChannelSuccess: (state, action) => {
      state.isNetworkOn = true;
      const { id } = action.payload;
      // console.log('Данные, пришедшие в редуктор removeChannelSuccess: ', id);
      if (!isNil(id)) {
        const channelsIds = Object.keys(state.channels.byId);
        if (channelsIds.includes(id.toString())) {
          const channelMessagesIds = state.channels.byId[id].messagesIds;
          const { [id]: channel, ...otherChannels } = state.channels.byId;
          state.channels.byId = otherChannels;
          state.channels.allIds = state.channels.allIds
            .filter((channelId) => channelId !== id.toString());
          channelMessagesIds.forEach((messageId) => {
            const { [messageId]: message, ...otherMessages } = state.messages.byId;
            state.messages.byId = otherMessages;
            state.messages.allIds = state.messages.allIds.filter((id) => id !== messageId);
          });
        }
        storage.setItem('state', JSON.stringify(state));
      }
    },
    removeChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
      storage.setItem('state', JSON.stringify(state));
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      state.channels.byId[id].name = name;
      storage.setItem('state', JSON.stringify(state));
    },
    renameChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
      storage.setItem('state', JSON.stringify(state));
    },
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
  login,
  logout,
  setInitialChannels,
  makeSignupUserFormInvalid,
  setUserStatus,
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  addMessageSuccess,
  addMessageFailure,
  addChannelSuccess,
  addChannelFailure,
  removeChannelSuccess,
  removeChannelFailure,
  renameChannelSuccess,
  renameChannelFailure,
  activateChannel,
  openAddModal,
  openRemoveModal,
  openRenameModal,
  closeModalWindow,
  toggleChannelDropDownMenu,
} = chatSlice.actions;

export default chatSlice.reducer;
