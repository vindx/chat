import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import AppLayout from '../components/styledComponents/AppLayout';
import ChannelsContainer from './ChannelsContainer';
import SideBarContainer from './SideBarContainer';
import Header from '../components/Header';
import MessagesContainer from './MessagesContainer';
import EditOrSendMessageContainer from './EditOrSendMessageContainer';

const AppLayoutContainer = ({ match: { params }, history, userId }) => {
  const [channelName, setChannelName] = useState('');
  const [messageEditing, setMessageEditing] = useState({
    onEdit: false,
    message: '',
    messageId: '',
  });
  const [lastMessageSent, setLastMessageSent] = useState({ message: '', messageId: '' });
  const [displaySideBar, setToggleSideBarDisplay] = useState(false);

  const handleToggleSideBarDisplay = () => {
    setToggleSideBarDisplay(!displaySideBar);
  };

  const handleInitiateMessageEditing = (
    e,
    { message, messageid: messageId } = {
      message: lastMessageSent.message,
      messageid: lastMessageSent.messageId,
    }
  ) => {
    if (message && messageId) {
      setMessageEditing((prevState) => ({
        ...prevState,
        onEdit: true,
        message,
        messageId,
      }));
    }
  };

  const handleCancelMessageEditing = () => {
    setMessageEditing((prevState) => ({ ...prevState, onEdit: false, message: '', messageId: '' }));
  };

  const handleSetLastMessageSent = (message, messageId) => {
    setLastMessageSent((prevState) => ({ ...prevState, message, messageId }));
  };

  useEffect(() => {
    handleCancelMessageEditing();
    handleSetLastMessageSent('', '');
  }, [params.channelId]);

  return (
    <AppLayout displaySideBar={displaySideBar}>
      <ChannelsContainer currentChannelId={params.channelId} history={history} />
      <SideBarContainer
        setChannelName={setChannelName}
        currentChannelId={params.channelId}
        history={history}
        displaySideBar={displaySideBar}
        toggleDisplaySideBar={handleToggleSideBarDisplay}
      />
      <Header channelName={channelName} />
      <MessagesContainer
        currentChannelId={params.channelId}
        activeUserId={userId}
        initEditing={handleInitiateMessageEditing}
        messageEditingInfo={messageEditing}
        setLastMessageSent={handleSetLastMessageSent}
      />
      <EditOrSendMessageContainer
        channelName={channelName}
        currentChannelId={params.channelId}
        onEditing={messageEditing.onEdit}
        messageForEditing={messageEditing.message}
        messageId={messageEditing.messageId}
        startEditing={handleInitiateMessageEditing}
        cancelEditing={handleCancelMessageEditing}
        setLastMessageSent={handleSetLastMessageSent}
      />
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
