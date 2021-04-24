/* eslint-disable no-param-reassign */
import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { channelsSlice } from './channelsSlice.js';

// const storage = window.localStorage;

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addMessageSuccess: (state, action) => {
      try {
        const { id, message } = action.payload;
        // console.log('Данные, пришедшие в редуктор addMessageSuccess: ', action.payload);
        state.byId[id] = { ...message, id };
        state.allIds = uniq([...state.allIds, id]);
      } catch (e) {
        console.log(e);
      }
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
