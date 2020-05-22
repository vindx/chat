import React, { useEffect, useState, createRef } from 'react';
import ReactDOM from 'react-dom';
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
  const [emojiObj, SetEmojiObj] = useState({ colons: '' });

  const emojiPicker = createRef();

  const triggerPicker = (e) => {
    e.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  // eslint-disable-next-line consistent-return
  const handleClick = (e) => {
    try {
      // eslint-disable-next-line react/no-find-dom-node
      const node = ReactDOM.findDOMNode(emojiPicker.current);
      if (!node.contains(e.target)) {
        // handle outside click down below
        SetEmojiPicker(!emojiPickerState);
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false);
    return () => {
      document.removeEventListener('mousedown', handleClick, false);
    };
  }, [emojiPickerState, emojiObj]);

  return (
    <>
      {channelName && (
        <SendMessageWrapper>
          {emojiPickerState && (
            <EmojiWrapper ref={emojiPicker}>
              <Picker emojiSize={20} onSelect={(emoji) => SetEmojiObj(emoji)} />
            </EmojiWrapper>
          )}
          <ButtonsWrapper>
            <Button onClick={triggerPicker} basic icon="smile outline" color="grey" />
          </ButtonsWrapper>
          {onEditing ? (
            <EditMessage
              emoji={emojiObj}
              currentChannelId={currentChannelId}
              close={cancelEditing}
              messageForEditing={messageForEditing}
              messageId={messageId}
              enterKey={ENTER_KEY}
              setLastMessageSent={setLastMessageSent}
            />
          ) : (
            <SendMessage
              emoji={emojiObj}
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
