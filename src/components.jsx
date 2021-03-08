import React from 'react';
import cn from 'classnames';
import axios from 'axios';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from './app/slice';
import routes from './routes';

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

const Channels = () => {
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const currentChannelId = useSelector((state) => state.currentChannelId);
  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
        <button className="ml-auto p-0 btn btn-link" type="button">+</button>
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

const Messages = () => {
  const messages = useSelector((state) => Object.values(state.messages.byId));
  console.log('messages внутри компонента Messages: ', messages);
  const dispatch = useDispatch();

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {messages.map(({ author, text, id }) => (
            <div className="text-break" key={id}>
              <b>{author}</b>
              :&nbsp;
              {text}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <Formik
            initialValues={{ text: '' }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log('Вы ввели: ', values.text);
              const channelId = 1;
              const request = {
                data: {
                  attributes: {
                    author: 'Ray Garraty',
                    text: values.text,
                    channelId,
                  },
                },
              };
              const response = await axios.post(routes.channelMessagesPath(channelId), request);
              const { data: { attributes } } = response.data;
              console.log('Ответ с сервера после отправки нового сообщения: ', attributes);
              dispatch(addMessage(attributes));
              setSubmitting(false);
              resetForm();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      name="text"
                      aria-label="body"
                      className="mr-2 form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.text}
                    />
                    {errors.text && touched.text}
                    <button
                      type="submit"
                      aria-label="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="d-block invalid-feedback" />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <div className="row h-100 pb-3">
    <Channels />
    <Messages />
  </div>
);
