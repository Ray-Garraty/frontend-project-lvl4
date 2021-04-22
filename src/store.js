import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import channelReducer from './slices/channelSlice.js';
import initReducer from './slices/initSlice.js';
import messageReducer from './slices/messageSlice.js';
import modalReducer from './slices/modalSlice.js';
import requestReducer from './slices/requestSlice.js';
import uiStateReducer from './slices/uiStateSlice.js';

export default configureStore({
  authReducer,
  channelReducer,
  initReducer,
  messageReducer,
  modalReducer,
  requestReducer,
  uiStateReducer,
});
