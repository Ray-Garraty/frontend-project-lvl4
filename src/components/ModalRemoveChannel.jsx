import { get } from 'lodash';
import i18next from 'i18next';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../contexts.js';
import { closeModalWindow } from '../slices/uiState.js';

export default () => {
  const socket = useContext(SocketContext);
  const channels = useSelector((state) => state.channelsState.byId);
  const channelId = useSelector((state) => state.uiState.modalWindow.channelId);
  const channelToRemove = (Object.values(channels)).find((channel) => channel.id === channelId);
  const name = get(channelToRemove, 'name', null);
  const dispatch = useDispatch();
  const closeModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  const removeChannel = (currentSocket) => async (e) => {
    e.preventDefault();
    try {
      currentSocket.emit('removeChannel', { id: channelId }, ({ status }) => {
        if (status === 'ok') {
          dispatch(closeModalWindow());
        }
      });
    } catch (err) {
      console.log(err);
    }
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
              <button className="btn btn-danger" type="button" onClick={removeChannel(socket)}>{i18next.t('remove')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
