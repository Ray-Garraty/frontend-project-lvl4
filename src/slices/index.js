import { combineReducers } from '@reduxjs/toolkit';
import channelsReducer, { actions as channelsActions } from './channels.js';
import messagesReducer, { actions as messagesActions } from './messages.js';
import uiStateReducer, { actions as uiActions } from './uiState.js';

export const actions = {
  ...channelsActions,
  ...messagesActions,
  ...uiActions,
};

const reducer = combineReducers({
  channelsState: channelsReducer,
  messagesState: messagesReducer,
  uiState: uiStateReducer,
});

export default reducer;
