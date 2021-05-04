import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { addMessageSuccess } from './messages.js';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { byId: {}, allIds: [] },
  reducers: {
    addChannelSuccess: (state, action) => {
      const channel = action.payload;
      const { id } = channel;
      return {
        byId: { ...state.byId, [id]: channel },
        allIds: uniq([...state.allIds, id.toString()]),
      };
    },
    removeChannelSuccess: (state, action) => {
      const id = action.payload;
      const { allIds } = state;
      /* почему-то сокет присылает оповещение 2 раза, что приводит к ошибкам, поэтому пришлось
      прикрутить проверку наличия id удаляемого канала в списке всех id каналов */
      if (allIds.includes(id.toString())) {
        const { [id]: channel, ...otherChannels } = state.byId;
        return {
          byId: otherChannels,
          allIds: state.allIds.filter((channelId) => channelId !== id.toString()),
        };
      }
      return null;
    },
    renameChannelSuccess: (state, action) => {
      const { id, name } = action.payload;
      const channelOldData = state.byId[id];
      return { byId: { ...state.byId, [id]: { ...channelOldData, name } }, allIds: state.allIds };
    },
  },
  extraReducers: {
    [addMessageSuccess]: (state, action) => {
      const { id, message } = action.payload;
      const { channelId } = message;
      const channelMessagesIds = state.byId[channelId].messagesIds;
      const channelOldData = state.byId[channelId];
      return {
        byId: {
          ...state.byId,
          [channelId]: { ...channelOldData, messagesIds: [...channelMessagesIds, id] },
        },
        allIds: state.allIds,
      };
    },
  },
});

export const {
  addChannelSuccess,
  removeChannelSuccess,
  renameChannelSuccess,
} = channelsSlice.actions;

export default channelsSlice.reducer;
