/* eslint-disable no-param-reassign */
import gon from 'gon';
import { createSlice, current } from '@reduxjs/toolkit';

console.log('gon в слайсе: ', gon);
const { currentChannelId } = gon;
const channelsById = {};
gon.channels.forEach((channel) => {
  const { id } = channel;
  channel.messagesIds = [];
  channelsById[id] = channel;
});
const allChannelIds = Object.keys(channelsById).sort((a, b) => a - b);
const messagesById = {};
gon.messages.forEach((message) => {
  const { id, channelId } = message;
  messagesById[id] = message;
  channelsById[channelId].messagesIds = [...channelsById[channelId].messagesIds, id];
});
const allMessagesIds = Object.keys(messagesById).sort((a, b) => a - b);

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentChannelId,
    channels: {
      byId: channelsById,
      allIds: allChannelIds,
    },
    messages: {
      byId: messagesById,
      allIds: allMessagesIds,
    },
  },
  reducers: {
    addMessage: (state, action) => {
      try {
        const message = action.payload;
        // console.log('message внутри редьюсера перед добавлением в state: ', message);
        const { channelId } = message;
        // добавляем messageId в массив messagesIds текущего канала
        // console.log('state в редьюсере: ', current(state));
        const channelMessagesIds = state.channels.byId[channelId].messagesIds;
        // console.log('channelMessagesIds в редьюсере: ', channelMessagesIds);
        state.channels.byId[channelId].messagesIds = [...channelMessagesIds, message.id];
        // добавляем message в объект messages.byId
        state.messages.byId[message.id] = message;
        state.messages.allIds = [...state.messages.allIds, message.id];
        // console.log('новый state в редьюсере: ', state);
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;
