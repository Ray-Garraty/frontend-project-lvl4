/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import i18next from 'i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChannelDropDownMenu } from '../slices/uiState.js';
import ModalAddChannel from './ModalAddChannel.jsx';
import ModalRemoveChannel from './ModalRemoveChannel.jsx';
import ModalRenameChannel from './ModalRenameChannel.jsx';
import ChannelsContainer from './ChannelsContainer.jsx';
import MessagesContainer from './MessagesContainer.jsx';

export default () => {
  const history = useHistory();
  const isAddModalOpened = useSelector((state) => state.uiState.modalWindow.addChannel.isOpened);
  const isRemoveModalOpened = useSelector(
    (state) => state.uiState.modalWindow.removeChannel.isOpened,
  );
  const isRenameModalOpened = useSelector(
    (state) => state.uiState.modalWindow.renameChannel.isOpened,
  );
  const dispatch = useDispatch();
  const handleDropDownMenu = (channelId) => (e) => {
    e.stopPropagation();
    dispatch(toggleChannelDropDownMenu(channelId));
  };
  const handleLogoutClick = () => {
    window.localStorage.clear();
    history.push('/login');
  };

  return (
    <div className="d-flex flex-column h-100">
      <nav className="mb-3 navbar navbar-expand-lg navbar-light bg-light">
        <a className="mr-auto navbar-brand" href="/">Hexlet Chat</a>
        <button className="btn btn-primary" type="button" onClick={handleLogoutClick}>{i18next.t('signout')}</button>
      </nav>
      <div className="row flex-grow-1 h-75 pb-3" onClick={handleDropDownMenu()}>
        {isAddModalOpened && <ModalAddChannel />}
        {isRemoveModalOpened && <ModalRemoveChannel />}
        {isRenameModalOpened && <ModalRenameChannel />}
        <ChannelsContainer />
        <MessagesContainer />
      </div>
    </div>
  );
};
