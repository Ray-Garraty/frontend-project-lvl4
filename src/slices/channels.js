/* eslint-disable no-param-reassign */
import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { messagesSlice } from './messages.js';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addChannelSuccess: (state, action) => {
      const channel = action.payload;
      const { id } = channel;
      state.channels.byId[id] = channel;
      state.channels.allIds = uniq([...state.channels.allIds, id.toString()]);
    },
    removeChannelSuccess: (state, action) => {
      const id = action.payload;
      const channelsIds = state.channels.allIds;
      /* почему-то сокет присылает оповещение 2 раза, что приводит к ошибкам, поэтому пришлось
      прикрутить проверку наличия id удаляемого канала в списке всех id каналов */
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
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      state.channels.byId[id].name = name;
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
} = channelsSlice.actions;

export default channelsSlice.reducer;
