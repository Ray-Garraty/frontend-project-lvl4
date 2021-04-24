/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import cn from 'classnames';
import i18next from 'i18next';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../init.jsx';
import { closeModalWindow } from '../slices/uiStateSlice.js';
import { addChannelSuccess, activateChannel } from '../slices/channelsSlice.js';
import {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  onNetworkIsDown,
} from '../slices/requestSlice.js';

export default () => {
  const dispatch = useDispatch();
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const channelsNames = channels.map((channel) => channel.name);
  const requestStatus = useSelector((state) => state.request);
  const pendingRequest = requestStatus === 'sending';
  const handleCloseModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  return (
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
                {i18next.t('addChannel')}
              </div>
              <button className="close" type="button" onClick={handleCloseModal} disabled={pendingRequest}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">{i18next.t('cancel')}</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ name: '' }}
                validate={({ name }) => {
                  const errors = {};
                  if (!name) {
                    errors.name = i18next.t('required');
                  }
                  if (channelsNames.includes(name)) {
                    errors.name = i18next.t('channelAlreadyExists');
                  }
                  if (name.length < 3 || name.length > 20) {
                    errors.name = i18next.t('from3to20symbols');
                  }
                  return errors;
                }}
                onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
                  try {
                    dispatch(onRequestPending());
                    await socket.emit('newChannel', { name }, ({ data }) => {
                      const newChannel = { ...data, messagesIds: [] };
                      dispatch(addChannelSuccess(newChannel));
                      dispatch(onRequestSuccess());
                      setSubmitting(false);
                      resetForm();
                      dispatch(closeModalWindow());
                      dispatch(activateChannel(newChannel.id));
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
  );
};