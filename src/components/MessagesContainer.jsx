import React from 'react';
import i18next from 'i18next';
import { Formik } from 'formik';
import { uniqueId } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  onNetworkIsDown,
} from '../slices/requestSlice.js';
import { socket } from '../init.jsx';

export default () => {
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.uiState.currentChannelId);
  const currentChannelMessages = useSelector((state) => {
    const allMessages = Object.values(state.chatState.messages.byId);
    return allMessages.filter((msg) => {
      if (!msg) {
        return false;
      }
      return msg.channelId === channelId;
    });
  });
  const isNetworkOn = useSelector((state) => state.requestState.isNetworkOn);
  const username = useSelector((state) => state.authState.activeUser.username);
  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {currentChannelMessages.map(({ username, text }) => (
            <div className="text-break" key={uniqueId()}>
              <b>{username}</b>
              :&nbsp;
              {text}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <Formik
            initialValues={{ text: '' }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const message = {
                username,
                text: values.text,
                channelId,
              };
              try {
                dispatch(onRequestPending());
                await socket.emit('newMessage', { message }, () => {
                  setSubmitting(false);
                  resetForm();
                  dispatch(onRequestSuccess());
                });
              } catch (e) {
                dispatch(onNetworkIsDown());
                setSubmitting(false);
                dispatch(onRequestFailure());
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      name="text"
                      aria-label="body"
                      className="mr-2 form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.text}
                      disabled={isSubmitting}
                    />
                    {errors.text && touched.text}
                    <button
                      type="submit"
                      aria-label="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {i18next.t('submit')}
                    </button>
                  </div>
                  <div className="d-block invalid-feedback">
                    {isNetworkOn ? '' : i18next.t('networkError')}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
