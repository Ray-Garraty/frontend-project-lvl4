import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { removeChannelSuccess } from './channels.js';

const messagesSlice = createSlice({
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
    [removeChannelSuccess]: (state, action) => {
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

export const { addMessageSuccess } = messagesSlice.actions;

export default messagesSlice.reducer;
