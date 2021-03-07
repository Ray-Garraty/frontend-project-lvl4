import { uniqueId } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

export const state = createSlice({
  name: 'state',
  initialState: {
    uiState: {
      form: {
        inputField: {
          value: '',
        },
      },
      currentChannelId: null,
    },
    channels: {
      byId: {
        1: {
          id: 1,
          name: 'general',
          removable: false,
          messagesIds: [],
        },
        2: {
          id: 2,
          name: 'random',
          removable: false,
          messagesIds: [],
        },
      },
      allIds: [1, 2],
    },
    messages: {
      byId: {},
      allIds: [],
    },
  },
  reducers: {
    addMessage: (state, action) => {
      const { userName, text, channelId } = action.payload;
      const message = {
        id: uniqueId(),
        author: userName,
        text,
        channelId,
      };
      const channelMessagesIds = state.channels.byId[channelId].messagesIds;
      const newMessagesIds = [channelMessagesIds, message.id];
      state.channels.byId[channelId].messagesIds = newMessagesIds;
      state.messages.byId[message.id] = message;
      state.messages.allIds = [...state.messages.allIds, message.id];
    },
  },
});

export const { addMessage } = state.actions;

export default state.reducer;
