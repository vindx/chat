import React, { useEffect, useReducer } from 'react';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';

import AppLayout from '../components/styledComponents/AppLayout';
import ChannelsContainer from './ChannelsContainer';
import SideBarContainer from './SideBarContainer';
import Header from '../components/Header';
import MessagesContainer from './MessagesContainer';
import EditOrSendMessageContainer from './EditOrSendMessageContainer';
import UserInfoModal from '../components/modals/UserInfoModal';

const initialState = {
  channelName: '',
  messageEditing: {
    onEdit: false,
    message: '',
    messageId: '',
  },
  lastMessageSent: { message: '', messageId: '' },
  displaySideBar: false,
  displayProfileInfoModal: {
    open: false,
    userId: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHANNEL_NAME':
      return { ...state, channelName: action.payload };
    case 'SET_MESSAGE_EDITING':
      return {
        ...state,
        messageEditing: {
          ...state.messageEditing,
          ...action.payload,
        },
      };
    case 'SET_LAST_MESSAGE_SENT':
      return {
        ...state,
        lastMessageSent: {
          ...state.lastMessageSent,
          ...action.payload,
        },
      };
    case 'TOGGLE_SIDEBAR_DISPLAY':
      return {
        ...state,
        displaySideBar: !state.displaySideBar,
      };
    case 'SET_PROFILE_INFO_MODAL_DISPLAY':
      return {
        ...state,
        displayProfileInfoModal: {
          ...state.displayProfileInfoModal,
          ...action.payload,
        },
      };
    default:
      throw new Error();
  }
};

const AppLayoutContainer = ({ match: { params }, history, userId }) => {
  const [state, dispatch] = useReducer(reducer, initialState, undefined);

  const handleToggleSideBarDisplay = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR_DISPLAY' });
  };

  const handleToggleProfileInfoModalDisplay = (e) => {
    const { id } = e.target;
    if (state.displayProfileInfoModal.open) {
      dispatch({ type: 'SET_PROFILE_INFO_MODAL_DISPLAY', payload: { open: false, userId: '' } });
    } else {
      dispatch({ type: 'SET_PROFILE_INFO_MODAL_DISPLAY', payload: { open: true, userId: id } });
    }
  };

  const handleInitiateMessageEditing = (
    e,
    { message, messageid: messageId } = {
      message: state.lastMessageSent.message,
      messageid: state.lastMessageSent.messageId,
    }
  ) => {
    if (message && messageId) {
      dispatch({ type: 'SET_MESSAGE_EDITING', payload: { onEdit: true, message, messageId } });
    }
  };

  const handleCancelMessageEditing = () => {
    dispatch({
      type: 'SET_MESSAGE_EDITING',
      payload: { onEdit: false, message: '', messageId: '' },
    });
  };

  const handleSetLastMessageSent = (message, messageId) => {
    dispatch({ type: 'SET_LAST_MESSAGE_SENT', payload: { message, messageId } });
  };

  const handleSetChannelName = (name) => {
    dispatch({ type: 'SET_CHANNEL_NAME', payload: name });
  };

  useEffect(() => {
    handleCancelMessageEditing();
    handleSetLastMessageSent('', '');
  }, [params.channelId]);

  return (
    <AppLayout displaySideBar={state.displaySideBar}>
      <ChannelsContainer
        currentChannelId={params.channelId}
        history={history}
        onProfileClick={handleToggleProfileInfoModalDisplay}
        activeUserId={userId}
      />
      <SideBarContainer
        setChannelName={handleSetChannelName}
        currentChannelId={params.channelId}
        history={history}
        displaySideBar={state.displaySideBar}
        toggleDisplaySideBar={handleToggleSideBarDisplay}
        onProfileClick={handleToggleProfileInfoModalDisplay}
      />
      <Header channelName={state.channelName} />
      <MessagesContainer
        currentChannelId={params.channelId}
        activeUserId={userId}
        initEditing={handleInitiateMessageEditing}
        messageEditingInfo={state.messageEditing}
        setLastMessageSent={handleSetLastMessageSent}
        onProfileClick={handleToggleProfileInfoModalDisplay}
      />
      <EditOrSendMessageContainer
        channelName={state.channelName}
        currentChannelId={params.channelId}
        onEditing={state.messageEditing.onEdit}
        messageForEditing={state.messageEditing.message}
        messageId={state.messageEditing.messageId}
        startEditing={handleInitiateMessageEditing}
        cancelEditing={handleCancelMessageEditing}
        setLastMessageSent={handleSetLastMessageSent}
      />
      <UserInfoModal
        history={history}
        onClose={handleToggleProfileInfoModalDisplay}
        open={state.displayProfileInfoModal.open}
        userId={state.displayProfileInfoModal.userId}
      />
      <ToastContainer />
    </AppLayout>
  );
};

AppLayoutContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      channelId: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  userId: PropTypes.string.isRequired,
};

export default AppLayoutContainer;
