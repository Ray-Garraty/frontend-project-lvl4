import { uniq, omitBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelActions } from './channels.js';

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
    [channelActions.removeChannelSuccess]: (state, action) => {
      const id = action.payload;
      const updatedMessages = omitBy(state.byId, ({ channelId }) => channelId === id);
      const allIds = Object.keys(updatedMessages);
      return { byId: updatedMessages, allIds };
    },
  },
});

export const { actions } = messagesSlice;

export default messagesSlice.reducer;
