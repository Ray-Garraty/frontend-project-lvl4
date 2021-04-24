import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';
import requestReducer from './slices/requestSlice.js';
import uiStateReducer from './slices/uiStateSlice.js';

const reducer = combineReducers({
  authState: authReducer,
  uiState: uiStateReducer,
  requestState: requestReducer,
  channelsState: channelsReducer,
  messagesState: messagesReducer,
});

export default configureStore({ reducer });
