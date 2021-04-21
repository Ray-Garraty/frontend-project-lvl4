/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import i18next from 'i18next';
import { Formik } from 'formik';
import { isEmpty, get, uniqueId } from 'lodash';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  logout,
  onRequestPending,
  onRequestSuccess,
  onRequestFailure,
  addMessageSuccess,
  addMessageFailure,
  addChannelSuccess,
  addChannelFailure,
  removeChannelSuccess,
  removeChannelFailure,
  renameChannelSuccess,
  renameChannelFailure,
  activateChannel,
  openAddModal,
  openRemoveModal,
  openRenameModal,
  closeModalWindow,
  toggleChannelDropDownMenu,
} from './slice.js';

const isProduction = process.env.NODE_ENV === 'production';
const domain = isProduction ? '' : 'http://localhost:5000';
export const socket = io(domain);

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

  const handleRenameModal = (id) => (e) => {
    e.preventDefault();
    dispatch(openRenameModal(id));
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

const Channels = () => {
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const currentChannelId = useSelector((state) => state.currentChannelId);
  const dispatch = useDispatch();

  socket.on('newChannel', (data) => {
    dispatch(addChannelSuccess(data));
  });

  socket.on('removeChannel', (data) => {
    dispatch(removeChannelSuccess(data));
  });

  socket.on('renameChannel', (data) => {
    dispatch(renameChannelSuccess(data));
  });

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

const Messages = () => {
  const dispatch = useDispatch();
  const currentChannelMessages = useSelector((state) => {
    const { currentChannelId } = state;
    const allMessages = Object.values(state.messages.byId);
    return allMessages.filter((msg) => {
      if (!msg) {
        return false;
      }
      return msg.channelId === currentChannelId;
    });
  });
  const channelId = useSelector((state) => state.currentChannelId);
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  const username = useSelector((state) => state.authState.activeUser.username);
  // console.log('messages внутри компонента Messages: ', messages);
  socket.on('newMessage', (data) => {
    dispatch(addMessageSuccess(data));
  });

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {currentChannelMessages.map(({ username, text }) => (
            <div className="text-break" key={uniqueId()}>
              <b>{username}</b>
              :&nbsp;
              {text}
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <Formik
            initialValues={{ text: '' }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const message = {
                username,
                text: values.text,
                channelId,
              };
              try {
                dispatch(onRequestPending());
                await socket.emit('newMessage', { message }, () => {
                  setSubmitting(false);
                  resetForm();
                  dispatch(onRequestSuccess());
                });
              } catch (e) {
                dispatch(addMessageFailure());
                setSubmitting(false);
                dispatch(onRequestFailure());
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
                      disabled={isSubmitting}
                    />
                    {errors.text && touched.text}
                    <button
                      type="submit"
                      aria-label="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {i18next.t('submit')}
                    </button>
                  </div>
                  <div className="d-block invalid-feedback">
                    {isNetworkOn ? '' : i18next.t('networkError')}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const ModalAddChannel = () => {
  const dispatch = useDispatch();
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const channelsNames = channels.map((channel) => channel.name);
  const requestStatus = useSelector((state) => state.request);
  const pendingRequest = requestStatus === 'sending';
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
                {i18next.t('addChannel')}
              </div>
              <button className="close" type="button" onClick={handleCloseModal} disabled={pendingRequest}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">{i18next.t('cancel')}</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ name: '' }}
                validate={({ name }) => {
                  const errors = {};
                  if (!name) {
                    errors.name = i18next.t('required');
                  }
                  if (channelsNames.includes(name)) {
                    errors.name = i18next.t('channelAlreadyExists');
                  }
                  if (name.length < 3 || name.length > 20) {
                    errors.name = i18next.t('from3to20symbols');
                  }
                  return errors;
                }}
                onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
                  try {
                    dispatch(onRequestPending());
                    await socket.emit('newChannel', { name }, ({ data }) => {
                      const newChannel = { ...data, messagesIds: [] };
                      dispatch(addChannelSuccess(newChannel));
                      dispatch(onRequestSuccess());
                      setSubmitting(false);
                      resetForm();
                      dispatch(closeModalWindow());
                      dispatch(activateChannel(newChannel.id));
                    });
                  } catch (e) {
                    console.log(e);
                    dispatch(addChannelFailure());
                    setSubmitting(false);
                    dispatch(onRequestFailure());
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
                        autoFocus
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
                          {i18next.t('cancel')}
                        </button>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting || !isEmpty(errors)}>
                          {i18next.t('submit')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
            <div className="modal-footer">
              <div className="d-block invalid-feedback">
                {isNetworkOn ? '' : i18next.t('networkError')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ModalRemoveChannel = () => {
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  const channelId = useSelector((state) => state.uiState.modalWindow.removeChannel.id);
  const channels = useSelector((state) => state.channels.byId);
  const channelToRemove = (Object.values(channels)).find((channel) => channel.id === channelId);
  const name = get(channelToRemove, 'name', null);
  const dispatch = useDispatch();
  const requestStatus = useSelector((state) => state.request);
  const pendingRequest = requestStatus === 'sending';
  const closeModal = (e) => {
    e.preventDefault();
    dispatch(closeModalWindow());
  };
  const removeChannel = (id) => async (e) => {
    e.preventDefault();
    try {
      dispatch(onRequestPending());
      socket.emit('removeChannel', { id: channelId }, ({ status }) => {
        if (status === 'ok') {
          dispatch(removeChannelSuccess(id));
          dispatch(closeModalWindow());
          dispatch(onRequestSuccess());
        }
      });
    } catch (err) {
      console.log(err);
      dispatch(removeChannelFailure());
      dispatch(onRequestFailure());
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
              <button className="btn btn-danger" type="button" onClick={removeChannel(channelId)} disabled={pendingRequest}>{i18next.t('remove')}</button>
              <div className="d-block invalid-feedback">
                {isNetworkOn ? '' : i18next.t('networkError')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ModalRenameChannel = () => {
  const dispatch = useDispatch();
  const isNetworkOn = useSelector((state) => state.isNetworkOn);
  const channels = useSelector((state) => Object.values(state.channels.byId));
  const channelId = useSelector((state) => state.uiState.modalWindow.renameChannel.id);
  const [channelName] = channels
    .filter((channel) => channel.id === channelId)
    .map((channel) => channel.name);
  const channelsNames = channels.map((channel) => channel.name);
  const requestStatus = useSelector((state) => state.request);
  const pendingRequest = requestStatus === 'sending';
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
                {i18next.t('renameChannel')}
              </div>
              <button className="close" type="button" onClick={handleCloseModal} disabled={pendingRequest}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">{i18next.t('close')}</span>
              </button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ name: '' }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = i18next.t('required');
                  }
                  if (channelName === values.name || channelsNames.includes(values.name)) {
                    errors.name = i18next.t('channelAlreadyExists');
                  }
                  return errors;
                }}
                onSubmit={async ({ name }, { setSubmitting, resetForm }) => {
                  try {
                    dispatch(onRequestPending());
                    socket.emit('renameChannel', ({ id: channelId, name }), ({ status }) => {
                      if (status === 'ok') {
                        dispatch(renameChannelSuccess({ id: channelId }));
                        dispatch(onRequestSuccess());
                        setSubmitting(false);
                        resetForm();
                        dispatch(closeModalWindow());
                        dispatch(activateChannel(channelId));
                      }
                    });
                  } catch (e) {
                    console.log(e);
                    dispatch(renameChannelFailure());
                    setSubmitting(false);
                    dispatch(onRequestFailure());
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
                        autoFocus
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
                          {i18next.t('cancel')}
                        </button>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting || !isEmpty(errors)}>
                          {i18next.t('submit')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
            <div className="modal-footer">
              <div className="d-block invalid-feedback">
                {isNetworkOn ? '' : i18next.t('networkError')}
              </div>
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
  const isRenameModalOpened = useSelector(
    (state) => state.uiState.modalWindow.renameChannel.isOpened,
  );
  const dispatch = useDispatch();
  const handleDropDownMenu = (channelId) => (e) => {
    e.stopPropagation();
    dispatch(toggleChannelDropDownMenu(channelId));
  };
  const handleLogoutClick = () => {
    dispatch(logout());
    window.localStorage.clear();
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
        <Channels />
        <Messages />
      </div>
    </div>
  );
};
