/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import axios from 'axios';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMessageSuccess,
  addMessageFailure,
  addChannelSuccess,
  addChannelFailure,
  activateChannel,
  openAddModal,
  openRemoveModal,
  closeModalWindow,
  toggleChannelDropDownMenu,
} from './app/slice';
import routes from './routes';

export const AuthorContext = React.createContext('Anonymous');

const switchToChannel = (id, handler) => () => {
  handler(activateChannel(id));
};

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
  const dispatch = useDispatch();
  return (
    <li className="nav-item">
      <button className={buttonClassNames} type="button" onClick={switchToChannel(id, dispatch)}>{name}</button>
    </li>
  );
};

const RemovableChannel = (props) => {
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

  const handleRemoveModal = (id) => (e) => {
    e.preventDefault();
    dispatch(openRemoveModal(id));
  };

  return (
    <li className="nav-item">
      <div className={divDropDownGroupClassNames} role="group">
        <button className={firstButtonClassNames} type="button" onClick={switchToChannel(id, dispatch)}>{name}</button>
        <button
          className={secondButtonClassNames}
          aria-haspopup="true"
          aria-expanded={isDropDownOpened}
          type="button"
          onClick={handleDropDownMenu(id)}
        />
        <div
          className={cn('dropdown-menu', { show: isDropDownOpened })}
          style={isDropDownOpened ? openedDropdownDivStyles : closedDropdownDivStyles }
          x-placement="bottom-start"
          aria-labelledby=""
          data-popper-reference-hidden={isDropDownOpened ? 'false' : false}
          data-popper-escape={isDropDownOpened ? 'false' : false}
          data-popper-placement={isDropDownOpened ? 'bottom-start' : false}
        >
          <a className="dropdown-item" href="#" role="button" onClick={handleRemoveModal(id)}>Remove</a>
          <a className="dropdown-item" href="#" role="button">Rename</a>
        </div>
      </div>
    </li>
  );
};

const Channels = () => {
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();
  const handleAddModal = (e) => {
    e.preventDefault();
    dispatch(openAddModal());
  };
  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>Channels</span>
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

const Messages = () => {
  const dispatch = useDispatch();
  const currentChannelMessages = useSelector((state) => {
    const { currentChannelId } = state;
    const allMessages = Object.values(state.messages.byId);
    return allMessages.filter(({ channelId }) => channelId === currentChannelId);
  });
  const channelId = useSelector((state) => state.currentChannelId);
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  // console.log('messages внутри компонента Messages: ', messages);
  const socket = io('http://localhost:5000');
  socket.on('newMessage', ({ data: { attributes } }) => {
    dispatch(addMessageSuccess(attributes));
  });

  return (
    <AuthorContext.Consumer>
      {(author) => (
        <div className="col h-100">
          <div className="d-flex flex-column h-100">
            <div id="messages-box" className="chat-messages overflow-auto mb-3">
              {currentChannelMessages.map(({ author, text, id }) => (
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
                // console.log('Вы ввели: ', values.text);
                  const request = {
                    data: {
                      attributes: {
                        author,
                        text: values.text,
                        channelId,
                      },
                    },
                  };
                  try {
                    const response = await axios
                      .post(routes.channelMessagesPath(channelId), request);
                    const { data: { attributes } } = response.data;
                    dispatch(addMessageSuccess(attributes));
                    setSubmitting(false);
                    resetForm();
                  } catch (e) {
                    dispatch(addMessageFailure());
                    setSubmitting(false);
                  }
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
                      <div className="d-block invalid-feedback">
                        {isNetworkOn ? '' : 'Network error. Please try again later'}
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </AuthorContext.Consumer>
  );
};

const ModalAddChannel = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const channelsNames = channels.map((channel) => channel.name);
  const handleCloseModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
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
                Add channel
              </div>
              <button className="close" type="button" onClick={handleCloseModal}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ name: '' }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = 'Required';
                  }
                  if (channelsNames.includes(values.name)) {
                    errors.name = 'Such channel already exists. Please choose another name';
                  }
                  return errors;
                }}
                onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
                  const request = { data: { attributes: { name } } };
                  try {
                    const response = await axios
                      .post(routes.channelsPath(), request);
                    const { data: { attributes } } = response.data;
                    dispatch(addChannelSuccess(attributes));
                    setSubmitting(false);
                    resetForm();
                    dispatch(closeModalWindow());
                  } catch (e) {
                    console.log(e);
                    dispatch(addChannelFailure());
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  values: { name },
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                      <input
                        className={cn('mb-2', 'form-control', { 'is-invalid': errors.name })}
                        required
                        name="name"
                        value={name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {errors.name && <div className="d-block mb-2 invalid-feedback">{errors.name}</div>}
                      <div className="d-flex justify-content-end">
                        <button
                          className="mr-2 btn btn-secondary"
                          type="button"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </button>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting || !isEmpty(errors)}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ModalRemoveChannel = () => {
  const channelId = useSelector((state) => state.uiState.modalWindow.removeChannel.id);
  const dispatch = useDispatch();
  const closeModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  const removeChannel = (id) => (e) => {
    e.preventDefault();
    console.log('Удаляю канал ', id);
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
                Remove channel
                {channelId}
              </div>
              <button className="close" type="button" onClick={closeModal}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={closeModal}>Close</button>
              <button className="btn btn-primary" type="button" onClick={removeChannel(channelId)}>Remove</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default () => {
  const isAddModalOpened = useSelector((state) => state.uiState.modalWindow.addChannel.isOpened);
  const isRemoveModalOpened = useSelector(
    (state) => state.uiState.modalWindow.removeChannel.isOpened,
  );
  const dispatch = useDispatch();
  const handleDropDownMenu = (channelId) => (e) => {
    e.stopPropagation();
    dispatch(toggleChannelDropDownMenu(channelId));
  };
  return (
    <div className="row h-100 pb-3" onClick={handleDropDownMenu()}>
      {isAddModalOpened && <ModalAddChannel />}
      {isRemoveModalOpened && <ModalRemoveChannel />}
      <Channels />
      <Messages />
    </div>
  );
};
