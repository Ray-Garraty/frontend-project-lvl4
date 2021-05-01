/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateChannel,
  openModalWindow,
  toggleChannelDropDownMenu,
} from '../slices/uiState.js';

export default (props) => {
  const { currentChannelId, channel: { id, name, removable } } = props;
  const isActive = id === currentChannelId ? 'btn-primary' : 'btn-light';
  const channelDropDownMenuId = useSelector((state) => state.uiState.dropDownMenu.channelId);
  const isDropDownOpened = id === channelDropDownMenuId;
  const permanentChannelButtonClassNames = cn(
    'nav-link',
    'btn-block',
    'mb-2',
    'text-left',
    'btn',
    { [isActive]: true },
  );
  const firstButtonClassNames = cn(
    'text-left',
    'flex-grow-1',
    'nav-link',
    'btn',
    { [isActive]: true },
  );
  const secondButtonClassNames = cn(
    'flex-grow-0',
    'dropdown-toggle',
    'dropdown-toggle-split',
    'btn',
    { [isActive]: true },
  );
  const divDropDownGroupClassNames = cn(
    'd-flex',
    'mb-2',
    'dropdown',
    'btn-group',
    { show: isDropDownOpened },
  );

  const closedDropdownDivStyles = {
    position: 'absolute',
    margin: '0px',
    top: '0px',
    left: '0px',
    opacity: '0',
    pointerEvents: 'none',
  };
  const openedDropdownDivStyles = {
    position: 'absolute',
    margin: '0px',
    inset: '0px auto auto 0px',
    transform: 'translate(69px, 44px)',
  };

  const dispatch = useDispatch();
  const handleDropDownMenu = (channelId) => (e) => {
    e.stopPropagation();
    dispatch(toggleChannelDropDownMenu(channelId));
  };

  const handleRemoveModal = (channelId) => (e) => {
    e.preventDefault();
    dispatch(openModalWindow({ type: 'removeChannel', channelId }));
  };

  const handleRenameModal = (channelId) => (e) => {
    e.preventDefault();
    dispatch(openModalWindow({ type: 'renameChannel', channelId }));
  };

  const handleActivateClick = (chnlId) => () => {
    dispatch(activateChannel(chnlId));
  };

  return removable
    ? (
      <li className="nav-item">
        <div className={divDropDownGroupClassNames} role="group">
          <button className={firstButtonClassNames} style={{ whiteSpace: 'nowrap', overflow: 'break-word', textOverflow: 'ellipsis' }} type="button" onClick={handleActivateClick(id)}>{name}</button>
          <button
            className={secondButtonClassNames}
            aria-haspopup="true"
            aria-expanded={isDropDownOpened}
            type="button"
            onClick={handleDropDownMenu(id)}
          />
          <div
            className={cn('dropdown-menu', { show: isDropDownOpened })}
            style={isDropDownOpened ? openedDropdownDivStyles : closedDropdownDivStyles}
            x-placement="bottom-start"
            aria-labelledby=""
            data-popper-reference-hidden={isDropDownOpened ? 'false' : false}
            data-popper-escape={isDropDownOpened ? 'false' : false}
            data-popper-placement={isDropDownOpened ? 'bottom-start' : false}
          >
            <a className="dropdown-item" href="#" role="button" onClick={handleRemoveModal(id)}>{i18next.t('remove')}</a>
            <a className="dropdown-item" href="#" role="button" onClick={handleRenameModal(id)}>{i18next.t('rename')}</a>
          </div>
        </div>
      </li>
    )
    : (
      <li className="nav-item">
        <button className={permanentChannelButtonClassNames} type="button" onClick={handleActivateClick(id)}>{name}</button>
      </li>
    );
};
