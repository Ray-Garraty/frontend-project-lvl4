import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './slice';

export default configureStore({
  reducer: {
    messages: messagesReducer,
  },
});
