/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import cn from 'classnames';
import i18next from 'i18next';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../init.jsx';
import { renameChannelSuccess } from '../slices/chat.js';
import { activateChannel, closeModalWindow } from '../slices/uiState.js';
import {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  onNetworkIsDown,
} from '../slices/request.js';

export default () => {
  const dispatch = useDispatch();
  const isNetworkOn = useSelector((state) => state.requestState.isNetworkOn);
  const channels = useSelector((state) => Object.values(state.chatState.channels.byId));
  const channelId = useSelector((state) => state.uiState.modalWindow.renameChannel.id);
  const [channelName] = channels
    .filter((channel) => channel.id === channelId)
    .map((channel) => channel.name);
  const channelsNames = channels.map((channel) => channel.name);
  const requestStatus = useSelector((state) => state.requestState.status);
  const pendingRequest = requestStatus === 'sending';
  const handleCloseModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  return (
    <SocketContext.Consumer>
      {(socket) => (
        <>
          <div className="fade modal-backdrop show" />
          <div
            className="fade modal show"
            role="dialog"
            aria-modal="true"
            tabIndex="-1"
            style={{ display: 'block' }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-title h4">
                    {i18next.t('renameChannel')}
                  </div>
                  <button className="close" type="button" onClick={handleCloseModal} disabled={pendingRequest}>
                    <span aria-hidden="true">x</span>
                    <span className="sr-only">{i18next.t('close')}</span>
                  </button>
                </div>
                <div className="modal-body">
                  <Formik
                    initialValues={{ name: '' }}
                    validate={(values) => {
                      const errors = {};
                      if (!values.name) {
                        errors.name = i18next.t('required');
                      }
                      if (channelName === values.name || channelsNames.includes(values.name)) {
                        errors.name = i18next.t('channelAlreadyExists');
                      }
                      return errors;
                    }}
                    onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
                      try {
                        dispatch(onRequestPending());
                        socket.emit('renameChannel', ({ id: channelId, name }), ({ status }) => {
                          if (status === 'ok') {
                            dispatch(renameChannelSuccess({ id: channelId }));
                            dispatch(onRequestSuccess());
                            setSubmitting(false);
                            resetForm();
                            dispatch(closeModalWindow());
                            dispatch(activateChannel(channelId));
                          }
                        });
                      } catch (e) {
                        console.log(e);
                        dispatch(onNetworkIsDown());
                        setSubmitting(false);
                        dispatch(onRequestFailure());
                      }
                    }}
                  >
                    {({
                      values: { name },
                      errors,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                          <input
                            autoFocus
                            className={cn('mb-2', 'form-control', { 'is-invalid': errors.name })}
                            required
                            name="name"
                            value={name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {errors.name && <div className="d-block mb-2 invalid-feedback">{errors.name}</div>}
                          <div className="d-flex justify-content-end">
                            <button
                              className="mr-2 btn btn-secondary"
                              type="button"
                              onClick={handleCloseModal}
                            >
                              {i18next.t('cancel')}
                            </button>
                            <button className="btn btn-primary" type="submit" disabled={isSubmitting || !isEmpty(errors)}>
                              {i18next.t('submit')}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className="modal-footer">
                  <div className="d-block invalid-feedback">
                    {isNetworkOn ? '' : i18next.t('networkError')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </SocketContext.Consumer>
  );
};
