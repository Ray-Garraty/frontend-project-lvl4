import React from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { openAddModal } from '../slices/uiState.js';
import RemovableChannel from './RemovableChannel.jsx';
import PermanentChannel from './PermanentChannel.jsx';

export default () => {
  const channels = useSelector((state) => Object.values(state.chatState.channels.byId));
  const currentChannelId = useSelector((state) => state.uiState.currentChannelId);
  const dispatch = useDispatch();

  const handleAddModal = (e) => {
    e.preventDefault();
    dispatch(openAddModal());
  };
  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>{i18next.t('channels')}</span>
        <button className="ml-auto p-0 btn btn-link" type="button" onClick={handleAddModal}>+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => (channel.removable
          ? (
            <RemovableChannel
              currentChannelId={currentChannelId}
              channel={channel}
              key={channel.id}
            />
          )
          : (
            <PermanentChannel
              currentChannelId={currentChannelId}
              channel={channel}
              key={channel.id}
            />
          )
        ))}
      </ul>
    </div>
  );
};
