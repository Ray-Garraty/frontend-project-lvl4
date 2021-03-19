/* eslint-disable no-param-reassign */
import gon from 'gon';
import { createSlice } from '@reduxjs/toolkit';

const { currentChannelId } = gon;
const channelsById = {};
gon.channels.forEach((channel) => {
  const { id } = channel;
  channel.messagesIds = [];
  channelsById[id] = channel;
});
const allChannelIds = Object.keys(channelsById).sort((a, b) => a - b);
const messagesById = {};
gon.messages.forEach((message) => {
  const { id, channelId } = message;
  messagesById[id] = message;
  channelsById[channelId].messagesIds = [...channelsById[channelId].messagesIds, id];
});
const allMessagesIds = Object.keys(messagesById).sort((a, b) => a - b);

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    request: 'idle',
    isNetworkOn: true,
    currentChannelId,
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
    channels: {
      byId: channelsById,
      allIds: allChannelIds,
    },
    messages: {
      byId: messagesById,
      allIds: allMessagesIds,
    },
  },
  reducers: {
    onRequestPending: (state) => {
      state.request = 'sending';
    },
    onRequestSuccess: (state) => {
      state.request = 'success';
    },
    onRequestFailure: (state) => {
      state.request = 'failure';
    },
    addMessageSuccess: (state, action) => {
      try {
        state.isNetworkOn = true;
        const message = action.payload;
        const { channelId } = message;
        const channelMessagesIds = state.channels.byId[channelId].messagesIds;
        state.channels.byId[channelId].messagesIds = [...channelMessagesIds, message.id];
        state.messages.byId[message.id] = message;
        state.messages.allIds = [...state.messages.allIds, message.id];
      } catch (e) {
        console.log(e);
      }
    },
    addMessageFailure: (state) => {
      state.isNetworkOn = false;
    },
    activateChannel: (state, action) => {
      const id = action.payload;
      state.currentChannelId = id;
    },
    addChannelSuccess: (state, action) => {
      state.isNetworkOn = true;
      const channel = action.payload;
      const { id } = channel;
      state.channels.byId[id] = channel;
    },
    addChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
    removeChannelSuccess: (state, action) => {
      state.isNetworkOn = true;
      const id = action.payload;
      const channelMessagesIds = state.channels.byId[id].messagesIds;
      const { [id]: channel, ...otherChannels } = state.channels.byId;
      state.channels.byId = otherChannels;
      channelMessagesIds.forEach((messageId) => {
        const { [messageId]: message, ...otherMessages } = state.messages.byId;
        state.messages.byId = otherMessages;
        state.messages.allIds = state.messages.allIds.filter((id) => id !== messageId);
      });
    },
    removeChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      state.channels.byId[id].name = name;
    },
    renameChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
    openAddModal: (state) => {
      state.uiState.modalWindow.addChannel.isOpened = true;
    },
    openRemoveModal: (state, action) => {
      const id = action.payload;
      state.uiState.modalWindow.removeChannel.isOpened = true;
      state.uiState.modalWindow.removeChannel.id = id;
    },
    openRenameModal: (state, action) => {
      const id = action.payload;
      state.uiState.modalWindow.renameChannel.isOpened = true;
      state.uiState.modalWindow.renameChannel.id = id;
    },
    closeModalWindow: (state) => {
      state.uiState.modalWindow.addChannel.isOpened = false;
      state.uiState.modalWindow.removeChannel.isOpened = false;
      state.uiState.modalWindow.renameChannel.isOpened = false;
    },
    toggleChannelDropDownMenu: (state, action) => {
      const id = action.payload || null;
      if (state.uiState.dropDownMenu.channelId === id) {
        state.uiState.dropDownMenu.channelId = null;
      } else {
        state.uiState.dropDownMenu.channelId = id;
      }
    },
  },
});

export const {
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
