import React from 'react';
import PropTypes from 'prop-types';

import { SendMessageWrapper } from '../components/styledComponents/SendMessage';
import SendMessage from '../components/SendMessage';
import EditMessage from '../components/EditMessage';

const ENTER_KEY = 13;

const EditOrSendMessageContainer = ({
  channelName,
  currentChannelId,
  onEditing,
  messageForEditing,
  messageId,
  cancelEditing,
}) => (
  <>
    {channelName && (
      <SendMessageWrapper>
        {onEditing ? (
          <EditMessage
            currentChannelId={currentChannelId}
            close={cancelEditing}
            messageForEditing={messageForEditing}
            messageId={messageId}
            enterKey={ENTER_KEY}
          />
        ) : (
          <SendMessage
            channelName={channelName}
            currentChannelId={currentChannelId}
            enterKey={ENTER_KEY}
          />
        )}
      </SendMessageWrapper>
    )}
  </>
);

EditOrSendMessageContainer.propTypes = {
  channelName: PropTypes.string.isRequired,
  currentChannelId: PropTypes.string.isRequired,
  onEditing: PropTypes.bool.isRequired,
  messageForEditing: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  cancelEditing: PropTypes.func.isRequired,
};

export default EditOrSendMessageContainer;
