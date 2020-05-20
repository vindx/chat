import React, { useState } from 'react';
import { Picker } from 'emoji-mart';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  ButtonsWrapper,
  SendMessageWrapper,
  EmojiWrapper,
} from '../components/styledComponents/SendMessage';
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
}) => {
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const [emoji2, SetEmoji] = useState({ colons: '' });

  const triggerPicker = (e) => {
    e.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  return (
    <>
      {channelName && (
        <SendMessageWrapper>
          {emojiPickerState && (
            <EmojiWrapper>
              <Picker emojiSize={20} onSelect={(emoji) => SetEmoji(emoji)} />
            </EmojiWrapper>
          )}
          <ButtonsWrapper>
            <Button onClick={triggerPicker} basic icon="smile outline" color="grey" />
          </ButtonsWrapper>
          {onEditing ? (
            <EditMessage
              emoji={emoji2}
              currentChannelId={currentChannelId}
              close={cancelEditing}
              messageForEditing={messageForEditing}
              messageId={messageId}
              enterKey={ENTER_KEY}
              setLastMessageSent={setLastMessageSent}
            />
          ) : (
            <SendMessage
              emoji={emoji2}
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
};

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
