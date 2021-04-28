import React from 'react';
import { get } from 'lodash';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../init.jsx';
import { closeModalWindow } from '../slices/uiState.js';
import {
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  onNetworkIsDown,
} from '../slices/request.js';

export default () => {
  const isNetworkOn = useSelector((state) => state.requestState.isNetworkOn);
  const channelId = useSelector((state) => state.uiState.modalWindow.removeChannel.id);
  const channels = useSelector((state) => state.chatState.channels.byId);
  const channelToRemove = (Object.values(channels)).find((channel) => channel.id === channelId);
  const name = get(channelToRemove, 'name', null);
  const dispatch = useDispatch();
  const requestStatus = useSelector((state) => state.requestState.status);
  const pendingRequest = requestStatus === 'sending';
  const closeModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  const removeChannel = (socket) => async (e) => {
    e.preventDefault();
    try {
      dispatch(onRequestPending());
      socket.emit('removeChannel', { id: channelId }, ({ status }) => {
        if (status === 'ok') {
          // dispatch(removeChannelSuccess(id));
          dispatch(closeModalWindow());
          dispatch(onRequestSuccess());
        }
      });
    } catch (err) {
      console.log(err);
      dispatch(onNetworkIsDown());
      dispatch(onRequestFailure());
    }
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
                    {i18next.t('removeChannel')}
                    {' '}
                    &quot;
                    {name}
                    &quot;
                  </div>
                  <button className="close" type="button" onClick={closeModal}>
                    <span aria-hidden="true">x</span>
                    <span className="sr-only">{i18next.t('close')}</span>
                  </button>
                </div>
                <div className="modal-body">
                  {i18next.t('areYouSure')}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={closeModal}>{i18next.t('cancel')}</button>
                  <button className="btn btn-danger" type="button" onClick={removeChannel(socket)} disabled={pendingRequest}>{i18next.t('remove')}</button>
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
