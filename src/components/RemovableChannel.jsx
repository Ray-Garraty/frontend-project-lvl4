/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { activateChannel } from '../slices/channelSlice.js';
import { openRemoveModal, openRenameModal } from '../slices/modalSlice.js';
import { toggleChannelDropDownMenu } from '../slices/uiStateSlice.js';

export default (props) => {
  const { currentChannelId, channel: { id, name } } = props;
  const isActive = id === currentChannelId ? 'btn-primary' : 'btn-light';
  const channelDropDownMenuId = useSelector((state) => state.uiState.dropDownMenu.channelId);
  const isDropDownOpened = id === channelDropDownMenuId;
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

  const handleRemoveModal = (chnlId) => (e) => {
    e.preventDefault();
    dispatch(openRemoveModal(chnlId));
  };

  const handleRenameModal = (chnlId) => (e) => {
    e.preventDefault();
    dispatch(openRenameModal(chnlId));
  };

  const switchToChannel = (chnlId, handler) => () => {
    handler(activateChannel(chnlId));
  };

  return (
    <li className="nav-item">
      <div className={divDropDownGroupClassNames} role="group">
        <button className={firstButtonClassNames} style={{ whiteSpace: 'nowrap', overflow: 'break-word', textOverflow: 'ellipsis' }} type="button" onClick={switchToChannel(id, dispatch)}>{name}</button>
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
  );
};
