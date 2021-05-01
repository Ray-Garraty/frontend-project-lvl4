import { combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './channels.js';
import messagesReducer from './messages.js';
import uiStateReducer from './uiState.js';

const reducer = combineReducers({
  channelsState: channelsReducer,
  messagesState: messagesReducer,
  uiState: uiStateReducer,
});

export default reducer;
