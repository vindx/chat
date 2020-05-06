import React, { useCallback, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Label } from 'semantic-ui-react';
import prettydate from 'pretty-date';
import PropTypes from 'prop-types';

import {
  CreatedAt,
  Message,
  MessagesWrapper,
  MessageText,
  MessageWrapper,
  UserName,
} from '../components/styledComponents/Messages';

const getMessagesQuery = gql`
  query($offset: Int, $limit: Int, $channelId: ID!) {
    getMessages(offset: $offset, limit: $limit, channelId: $channelId) {
      id
      text
      user {
        id
        userName
      }
      createdAt
    }
  }
`;

const messageSubscription = gql`
  subscription($channelId: ID!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        id
        userName
      }
      createdAt
    }
  }
`;

const MessagesContainer = ({ currentChannelId = '', activeUserId }) => {
  const messagesLimit = 30;
  const {
    subscribeToMore,
    loading,
    error,
    data: { getMessages: messages } = {},
    fetchMore,
  } = useQuery(getMessagesQuery, {
    variables: { channelId: currentChannelId, offset: 0, limit: messagesLimit },
    fetchPolicy: 'network-only',
  });

  const observer = useRef();
  const lastMessageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('show');
          fetchMore({
            variables: {
              channelId: currentChannelId,
              offset: messages.length,
              limit: messagesLimit,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...prev,
                getMessages: [...prev.getMessages, ...fetchMoreResult.getMessages],
              };
            },
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, messages, fetchMore, currentChannelId]
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (currentChannelId) {
      const unSubscribe = subscribeToMore({
        document: messageSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return {
            ...prev,
            getMessages: [subscriptionData.data.newChannelMessage, ...prev.getMessages],
          };
        },
      });
      return () => {
        unSubscribe();
      };
    }
  }, [currentChannelId, subscribeToMore]);

  if (loading) return <p>Loading...</p>;
  if (!messages) {
    return (
      <>
        {currentChannelId && error && <Label color="red">{error.message}</Label>}
        <MessagesWrapper center>Please choose channel</MessagesWrapper>
      </>
    );
  }

  return (
    <MessagesWrapper>
      {[...messages].map(({ id, text, user: { id: userId, userName }, createdAt }, index) => (
        <MessageWrapper key={`message-${id}`} myMessage={activeUserId === userId}>
          <Message
            ref={messages.length === index + 5 ? lastMessageElementRef : null}
            myMessage={activeUserId === userId}
          >
            <UserName>{userName}</UserName>
            <MessageText>{text}</MessageText>
            <CreatedAt>{prettydate.format(new Date(Number(createdAt)))}</CreatedAt>
          </Message>
        </MessageWrapper>
      ))}
    </MessagesWrapper>
  );
};

MessagesContainer.propTypes = {
  currentChannelId: PropTypes.string,
  activeUserId: PropTypes.string.isRequired,
};
MessagesContainer.defaultProps = {
  currentChannelId: undefined,
};

export default MessagesContainer;
