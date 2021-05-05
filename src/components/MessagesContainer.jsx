import i18next from 'i18next';
import { Formik } from 'formik';
import { uniqueId } from 'lodash';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';
import { SocketContext } from '../contexts.js';

export default () => {
  const socket = useContext(SocketContext);
  const channelId = useSelector((state) => state.uiState.currentChannelId);
  const currentChannelMessages = useSelector((state) => {
    const allMessages = Object.values(state.messagesState.byId);
    return allMessages.filter((msg) => {
      if (!msg) {
        return false;
      }
      return msg.channelId === channelId;
    });
  });
  const { username } = JSON.parse(window.localStorage.getItem('user'));
  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {currentChannelMessages.map((msg) => (
            <div className="text-break" key={uniqueId()}>
              <b>{msg.username}</b>
              :&nbsp;
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <Formik
            initialValues={{ text: '' }}
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
              const message = {
                username,
                text: values.text,
                channelId,
              };
              try {
                await socket.emit('newMessage', { message }, () => {
                  setSubmitting(false);
                  resetForm();
                });
              } catch (e) {
                console.log(e);
                setErrors({ networkError: i18next.t('networkError') });
                setSubmitting(false);
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
                    {errors.networkError}
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
