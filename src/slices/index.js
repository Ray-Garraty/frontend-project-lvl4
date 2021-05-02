import { combineReducers } from '@reduxjs/toolkit';
import channelsSlice from './channels.js';
import messagesSlice from './messages.js';
import uiStateSlice from './uiState.js';

export const channelsActions = channelsSlice.actions;
export const messagesActions = messagesSlice.actions;
export const uiStateActions = uiStateSlice.actions;

const reducer = combineReducers({
  channelsState: channelsSlice.reducer,
  messagesState: messagesSlice.reducer,
  uiState: uiStateSlice.reducer,
});

export default reducer;
