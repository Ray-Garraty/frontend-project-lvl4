/* eslint-disable no-param-reassign */
import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { channelsSlice } from './channels.js';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addMessageSuccess: (state, action) => {
      const { id, message } = action.payload;
      const { channelId } = message;
      state.messages.byId[id] = { ...message, id };
      state.messages.allIds = uniq([...state.messages.allIds, id]);
      const channelMessagesIds = state.channels.byId[channelId].messagesIds;
      state.channels.byId[channelId].messagesIds = [...channelMessagesIds, id];
    },
  },
  extraReducers: {
    [channelsSlice.actions.removeChannelSuccess]: (state, action) => {
      const { channelMessagesIds } = action.payload;
      channelMessagesIds.forEach((messageId) => {
        const { [messageId]: message, ...otherMessages } = state.byId;
        state.byId = otherMessages;
        state.allIds = state.allIds.filter((msgId) => msgId !== messageId);
      });
    },
  },
});

export const { addMessageSuccess } = messagesSlice.actions;

export default messagesSlice.reducer;
