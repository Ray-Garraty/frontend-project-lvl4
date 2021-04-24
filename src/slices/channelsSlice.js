/* eslint-disable no-param-reassign */
import { isNil } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { messagesSlice } from './messagesSlice.js';

// const storage = window.localStorage;

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addChannelSuccess: (state, action) => {
      const channel = action.payload;
      const { id } = channel;
      state.byId[id] = channel;
      state.allIds = [...state.allIds, id.toString()];
    },
    removeChannelSuccess: (state, action) => {
      const { id } = action.payload;
      // console.log('Данные, пришедшие в редуктор removeChannelSuccess: ', id);
      if (!isNil(id)) {
        const channelsIds = Object.keys(state.byId);
        if (channelsIds.includes(id.toString())) {
          const { [id]: channel, ...otherChannels } = state.byId;
          state.byId = otherChannels;
          state.allIds = state.allIds.filter((channelId) => channelId !== id.toString());
        }
      }
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      state.byId[id].name = name;
    },
  },
  extraReducers: {
    [messagesSlice.actions.addMessageSuccess]: (state, action) => {
      const { id, message } = action.payload;
      const { channelId } = message;
      const channelMessagesIds = state.byId[channelId].messagesIds;
      state.byId[channelId].messagesIds = [...channelMessagesIds, id];
    },
  },
});

export const {
  addChannelSuccess,
  removeChannelSuccess,
  renameChannelSuccess,
  activateChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
