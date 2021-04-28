import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth.js';
import chatReducer from './chat.js';
import requestReducer from './request.js';
import uiStateReducer from './uiState.js';

const reducer = combineReducers({
  authState: authReducer,
  chatState: chatReducer,
  uiState: uiStateReducer,
  requestState: requestReducer,
});

export default reducer;
