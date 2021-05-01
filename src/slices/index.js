import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chat.js';
import uiStateReducer from './uiState.js';

const reducer = combineReducers({
  chatState: chatReducer,
  uiState: uiStateReducer,
});

export default reducer;
