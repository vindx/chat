import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import {
  MessagesInfoWrapper,
  OptionsWrapper,
  RefreshIconWrapper,
  SearchMessageContainer,
} from '../../styledComponents/UserInfo';
import UserInfoMessage from './UserInfoMessage';
import { CustomInput } from '../../styledComponents/GlobalStyle';
import { searchMessages } from '../../../redux/actions';

const UserInfoMessages = ({ messages, switchChannel, userId, fetchMoreMessages }) => {
  const [searching, setSearching] = useState(false);
  const dispatch = useDispatch();
  const observer = useRef();

  const fetchMessages = (id, offset, limit) =>
    fetchMoreMessages({
      variables: {
        id,
        offset,
        limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          getUser: {
            ...prev.getUser,
            messages: [...fetchMoreResult.getUser.messages],
          },
        };
      },
    });

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

  const handleResetMessages = () => {
    setSearching(false);
    fetchMessages(userId, 0);
  };

  let timerId;
  const handleFindMessages = (e) => {
    const text = e.target.value;
    clearTimeout(timerId);
    if (text.length > 1) {
      timerId = setTimeout(async () => {
        setSearching(true);
        dispatch(searchMessages({ userId, text }));
      }, 300);
    }
    if (text.length === 0) {
      setSearching(false);
      fetchMessages(userId, 0);
    }
  };

  return [
    <OptionsWrapper key="messages-options-wrapper">
      <SearchMessageContainer>
        <CustomInput placeholder="Search..." icon="search" fluid onChange={handleFindMessages} />
      </SearchMessageContainer>
      <RefreshIconWrapper>
        <Icon name="refresh" onClick={handleResetMessages} />
      </RefreshIconWrapper>
    </OptionsWrapper>,
    <MessagesInfoWrapper key="messages-container">
      {messages.map((message, index) => (
        <UserInfoMessage
          refLink={index === messages.length - 3 && !searching ? lastMessageElementRef : null}
          message={message}
          key={message.id}
          switchChannel={switchChannel}
        />
      ))}
    </MessagesInfoWrapper>,
  ];
};

UserInfoMessages.propTypes = {
  userId: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.array.isRequired,
  switchChannel: PropTypes.func.isRequired,
  fetchMoreMessages: PropTypes.func.isRequired,
};

export default UserInfoMessages;
