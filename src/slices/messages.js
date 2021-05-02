import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { channelsActions } from './channels.js';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addMessageSuccess: (state, action) => {
      const { id, message } = action.payload;
      return {
        byId: { ...state.byId, [id]: { ...message, id } },
        allIds: uniq([...state.allIds, id]),
      };
    },
  },
  extraReducers: {
    [channelsActions]: (state, action) => {
      const { channelMessagesIds } = action.payload;
      channelMessagesIds.forEach((messageId) => {
        const { [messageId]: message, ...otherMessages } = state.byId;
        return {
          byId: otherMessages,
          allIds: state.allIds.filter((msgId) => msgId !== messageId),
        };
      });
    },
  },
});

export const { messagesActions } = messagesSlice;

export default messagesSlice;
