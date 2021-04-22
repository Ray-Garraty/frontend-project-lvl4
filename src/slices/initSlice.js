/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || {
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

export const initSlice = createSlice({
  name: 'init',
  initialState,
  reducers: {
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
  },
});

export const { setInitialChannels } = initSlice.actions;

export default initSlice.reducer;
