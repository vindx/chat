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
  startEditing,
  cancelEditing,
  setLastMessageSent,
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
            setLastMessageSent={setLastMessageSent}
          />
        ) : (
          <SendMessage
            channelName={channelName}
            currentChannelId={currentChannelId}
            enterKey={ENTER_KEY}
            startEditing={startEditing}
          />
        )}
      </SendMessageWrapper>
    )}
  </>
);

EditOrSendMessageContainer.propTypes = {
  channelName: PropTypes.string.isRequired,
  currentChannelId: PropTypes.string,
  onEditing: PropTypes.bool.isRequired,
  messageForEditing: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  setLastMessageSent: PropTypes.func.isRequired,
};
EditOrSendMessageContainer.defaultProps = {
  currentChannelId: undefined,
};

export default EditOrSendMessageContainer;
