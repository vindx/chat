import React from 'react';
import prettydate from 'pretty-date';
import PropTypes from 'prop-types';

import {
  MessageInfoChannel,
  MessageInfoChannelWrapper,
  MessageInfoText,
  MessageInfoWrapper,
  MessagesInfoWrapper,
} from '../../styledComponents/UserInfo';
import { CreatedAt } from '../../styledComponents/Messages';

const UserInfoMessage = ({ message: { text, createdAt, channel } }) => (
  <MessageInfoWrapper>
    <MessageInfoText>{text}</MessageInfoText>
    <CreatedAt>{prettydate.format(new Date(Number(createdAt)))}</CreatedAt>
    <MessageInfoChannelWrapper>
      at the
      <MessageInfoChannel>{channel.name}</MessageInfoChannel>
      channel
    </MessageInfoChannelWrapper>
  </MessageInfoWrapper>
);

const UserInfoMessages = ({ messages }) => (
  <MessagesInfoWrapper>
    {messages.map((message) => (
      <UserInfoMessage message={message} key={message.id} />
    ))}
  </MessagesInfoWrapper>
);

UserInfoMessage.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    createdAt: PropTypes.string,
    channel: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

UserInfoMessages.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
};

export default UserInfoMessages;
