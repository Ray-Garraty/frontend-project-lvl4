/* eslint-disable no-param-reassign */
import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const storage = window.localStorage;

const initialState = JSON.parse(storage.getItem('state')) || {
  channels: {
    byId: [],
    allIds: [],
  },
  messages: {
    byId: [],
    allIds: [],
  },
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessageSuccess: (state, action) => {
      try {
        state.isNetworkOn = true;
        const { id, message } = action.payload;
        // console.log('Данные, пришедшие в редуктор addMessageSuccess: ', action.payload);
        const { channelId } = message;
        const channelMessagesIds = state.channels.byId[channelId].messagesIds;
        state.channels.byId[channelId].messagesIds = [...channelMessagesIds, id];
        state.messages.byId[id] = { ...message, id };
        state.messages.allIds = uniq([...state.messages.allIds, id]);
        storage.setItem('state', JSON.stringify(state));
      } catch (e) {
        console.log(e);
      }
    },
    addMessageFailure: (state) => {
      state.isNetworkOn = false;
      storage.setItem('state', JSON.stringify(state));
    },
  },
});

export const { addMessageSuccess, addMessageFailure } = messageSlice.actions;

export default messageSlice.reducer;
