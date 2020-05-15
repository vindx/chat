import React from 'react';
import PropTypes from 'prop-types';

import { MessagesInfoWrapper } from '../../styledComponents/UserInfo';
import UserInfoMessage from './UserInfoMessage';

const UserInfoMessages = ({ messages, switchChannel }) => (
  <MessagesInfoWrapper>
    {messages.map((message) => (
      <UserInfoMessage message={message} key={message.id} switchChannel={switchChannel} />
    ))}
  </MessagesInfoWrapper>
);

UserInfoMessages.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
  switchChannel: PropTypes.func.isRequired,
};

export default UserInfoMessages;
