/* eslint-disable no-param-reassign */
import { isNil } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

// const storage = window.localStorage;

const initialState = {
  currentChannelId: null,
  channels: {
    byId: [],
    allIds: [],
  },
  messages: {
    byId: [],
    allIds: [],
  },
};

export const channelSlice = createSlice({
  name: 'channelsState',
  initialState,
  reducers: {
    activateChannel: (state, action) => {
      const id = action.payload;
      state.currentChannelId = id;
    },
    addChannelSuccess: (state, action) => {
      state.isNetworkOn = true;
      const channel = { ...action.payload, messagesIds: [] };
      const { id } = channel;
      state.channels.byId[id] = channel;
      if (!state.channels.allIds.includes(id.toString())) {
        state.channels.allIds = [...state.channels.allIds, id.toString()];
      }
    },
    addChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
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
            state.messages.allIds = state.messages.allIds.filter((msgId) => msgId !== messageId);
          });
        }
      }
    },
    removeChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      state.byId[id].name = name;
    },
    renameChannelFailure: (state) => {
      state.uiState.modalWindow.error = 'Network error. Try again later';
      state.isNetworkOn = false;
    },
  },
});

export const {
  addChannelSuccess,
  addChannelFailure,
  removeChannelSuccess,
  removeChannelFailure,
  renameChannelSuccess,
  renameChannelFailure,
  activateChannel,
} = channelSlice.actions;

export default channelSlice.reducer;
