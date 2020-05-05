import React, { useCallback, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Comment, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Messages from '../components/Messages';

const getMessagesQuery = gql`
  query($offset: Int, $limit: Int, $channelId: ID!) {
    getMessages(offset: $offset, limit: $limit, channelId: $channelId) {
      id
      text
      user {
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
        userName
      }
      createdAt
    }
  }
`;

const MessagesContainer = ({ currentChannelId = '' }) => {
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
        <Messages style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Please choose channel
        </Messages>
      </>
    );
  }

  return (
    <Messages>
      <Comment.Group>
        {[...messages].reverse().map(({ id, text, user: { userName }, createdAt }, index) => (
          <Comment key={`message-${id}`}>
            <Comment.Content>
              <Comment.Author as="a">{userName}</Comment.Author>
              <Comment.Metadata>
                <div ref={index === 7 ? lastMessageElementRef : null}>
                  {new Date(createdAt * 1000).toString()}
                </div>
              </Comment.Metadata>
              <Comment.Text>{text}</Comment.Text>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    </Messages>
  );
};

MessagesContainer.propTypes = {
  currentChannelId: PropTypes.string,
};
MessagesContainer.defaultProps = {
  currentChannelId: undefined,
};

export default MessagesContainer;
