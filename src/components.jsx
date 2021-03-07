import React from 'react';
import cn from 'classnames';

const PermanentChannel = (props) => {
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
      ::marker
      <button className={buttonClassNames} type="button">{name}</button>
    </li>
  );
};

const RemovableChannel = (props) => {
  const { currentChannelId, channel: { id, name } } = props;
  const isActive = id === currentChannelId ? 'btn-primary' : 'btn-light';
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
  const dropDownDivStyles = {
    position: 'absolute',
    top: '0px',
    margin: '0px',
    opacity: '0',
    'pointer-events': 'none',
  };
  return (
    <li className="nav-item">
      ::marker
      <div className="d-flex mb-2 dropdown btn-group" role="group">
        <button className={firstButtonClassNames} type="button">{name}</button>
        <button
          className={secondButtonClassNames}
          aria-haspopup="true"
          aria-expanded="false"
          type="button"
        >
          ::after
        </button>
        <div
          className="dropdown-menu"
          style={dropDownDivStyles}
          x-placement="bottom-start"
          aria-labelledby=""
        >
          <a className="dropdown-item" href="#" role="button">Remove</a>
          <a className="dropdown-item" href="#" role="button">Rename</a>
        </div>
      </div>
    </li>
  );
};

const Channels = (props) => {
  const { channels, currentChannelId } = props;
  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button className="ml-auto p-0 btn btn-link" type="button">+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill">
        {channels.map((channel) => (channel.removable
          ? <RemovableChannel currentChannelId={currentChannelId} channel={channel} key={channel.id}/>
          : <PermanentChannel currentChannelId={currentChannelId} channel={channel} key={channel.id}/>
        ))}
      </ul>
    </div>
  );
};

const Messages = (props) => {
  const { messages } = props;
  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {messages.map(({ author, text }) => (
            <div className="text-break">
              <b>{author}</b>
              :
              {text}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <form noValidate>
            <div className="form-group">
              <div className="input-group">
                <input className="mr-2 form-control" name="body" aria-label="body" value="" />
                <button className="btn btn-primary" aria-label="submit" type="submit">Submit</button>
                <div className="d-block invalid-feedback" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default (props) => {
  const { channels, messages } = props;
  return (
    <div className="row h-100 pb-3">
      <Channels channels={channels} />
      <Messages messages={messages} />
    </div>
  );
};
