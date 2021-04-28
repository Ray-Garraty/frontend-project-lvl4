import React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { activateChannel } from '../slices/uiState.js';

export default (props) => {
  const dispatch = useDispatch();
  const handleClick = (id) => () => {
    dispatch(activateChannel(id));
  };
  const { currentChannelId, channel: { id, name } } = props;
  const isActive = id === currentChannelId ? 'btn-primary' : 'btn-light';
  const buttonClassNames = cn(
    'nav-link',
    'btn-block',
    'mb-2',
    'text-left',
    'btn',
    { [isActive]: true },
  );
  return (
    <li className="nav-item">
      <button className={buttonClassNames} type="button" onClick={handleClick(id)}>{name}</button>
    </li>
  );
};
