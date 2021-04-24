import React from 'react';
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { activateChannel } from '../slices/channelsSlice.js';

export default (props) => {
  const switchToChannel = (id, handler) => () => {
    handler(activateChannel(id));
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
  const dispatch = useDispatch();
  return (
    <li className="nav-item">
      <button className={buttonClassNames} type="button" onClick={switchToChannel(id, dispatch)}>{name}</button>
    </li>
  );
};
