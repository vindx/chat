import React, { useState } from 'react';
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

  const handleInitiateMessageEditing = (e, { message, messageid: messageId }) => {
    setMessageEditing((prevState) => ({
      ...prevState,
      onEdit: true,
      message,
      messageId,
    }));
  };

  const handleCancelMessageEditing = () => {
    setMessageEditing((prevState) => ({ ...prevState, onEdit: false, message: '', messageId: '' }));
  };

  return (
    <AppLayout>
      <ChannelsContainer currentChannelId={params.channelId} history={history} />
      <SideBarContainer
        setChannelName={setChannelName}
        currentChannelId={params.channelId}
        history={history}
      />
      <Header channelName={channelName} />
      <MessagesContainer
        currentChannelId={params.channelId}
        activeUserId={userId}
        initEditing={handleInitiateMessageEditing}
      />
      <EditOrSendMessageContainer
        channelName={channelName}
        currentChannelId={params.channelId}
        onEditing={messageEditing.onEdit}
        messageForEditing={messageEditing.message}
        messageId={messageEditing.messageId}
        cancelEditing={handleCancelMessageEditing}
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
