import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import { MessagesInfoWrapper } from '../../styledComponents/UserInfo';
import UserInfoMessage from './UserInfoMessage';

const UserInfoMessages = ({ messages, switchChannel, userId, fetchMoreMessages }) => {
  const observer = useRef();
  const lastMessageElementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreMessages({
            variables: {
              id: userId,
              offset: messages.length,
              // limit - default value 10 (on server)
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...prev,
                getUser: {
                  ...prev.getUser,
                  messages: [...prev.getUser.messages, ...fetchMoreResult.getUser.messages],
                },
              };
            },
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [messages, fetchMoreMessages, userId]
  );

  return (
    <MessagesInfoWrapper>
      {messages.map((message, index) => (
        <UserInfoMessage
          refLink={index === messages.length - 3 ? lastMessageElementRef : null}
          message={message}
          key={message.id}
          switchChannel={switchChannel}
        />
      ))}
    </MessagesInfoWrapper>
  );
};

UserInfoMessages.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
  switchChannel: PropTypes.func.isRequired,
  fetchMoreMessages: PropTypes.func.isRequired,
};

export default UserInfoMessages;
