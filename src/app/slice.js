/* eslint-disable no-param-reassign */
import gon from 'gon';
import { createSlice, current } from '@reduxjs/toolkit';

// console.log('gon в слайсе: ', gon);
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
    isNetworkOn: true,
    currentChannelId,
    uiState: {
      modalWindow: {
        isOpened: false,
        error: null,
        input: {
          isValid: true,
        },
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
      state.channels.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
    toggleModalWindow: (state) => {
      state.uiState.modalWindow.isOpened = !state.uiState.modalWindow.isOpened;
    },
  },
});

export const {
  addMessageSuccess,
  addMessageFailure,
  addChannelSuccess,
  addChannelFailure,
  activateChannel,
  toggleModalWindow,
} = chatSlice.actions;

export default chatSlice.reducer;
