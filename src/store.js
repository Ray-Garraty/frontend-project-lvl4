import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import chatReducer from './slices/chatSlice.js';
import requestReducer from './slices/requestSlice.js';
import uiStateReducer from './slices/uiStateSlice.js';

const reducer = combineReducers({
  authState: authReducer,
  chatState: chatReducer,
  uiState: uiStateReducer,
  requestState: requestReducer,
});

export default configureStore({ reducer });
