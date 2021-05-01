import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chat.js';
import requestReducer from './request.js';
import uiStateReducer from './uiState.js';

const reducer = combineReducers({
  chatState: chatReducer,
  uiState: uiStateReducer,
  requestState: requestReducer,
});

export default reducer;
