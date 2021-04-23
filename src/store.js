import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import channelReducer from './slices/channelSlice.js';
import initReducer from './slices/initSlice.js';
import messageReducer from './slices/messageSlice.js';
import modalReducer from './slices/modalSlice.js';
import requestReducer from './slices/requestSlice.js';
import uiStateReducer from './slices/uiStateSlice.js';

const reducer = {
  authState: authReducer,
  channelsState: channelReducer,
  initializeState: initReducer,
  messagesState: messageReducer,
  modalWindowsState: modalReducer,
  requestState: requestReducer,
  uiState: uiStateReducer,
};

export default configureStore({ reducer });
