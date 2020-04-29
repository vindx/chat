import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Comment, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Messages from '../components/Messages';

const getMessagesQuery = gql`
  query($channelId: ID!) {
    getMessages(channelId: $channelId) {
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
  const { subscribeToMore, loading, error, data: { getMessages: messages } = {} } = useQuery(
    getMessagesQuery,
    {
      variables: { channelId: currentChannelId },
      fetchPolicy: 'network-only',
    }
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
            getMessages: [...prev.getMessages, subscriptionData.data.newChannelMessage],
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
        {messages.map(({ id, text, user: { userName }, createdAt }) => (
          <Comment key={`message-${id}`}>
            <Comment.Content>
              <Comment.Author as="a">{userName}</Comment.Author>
              <Comment.Metadata>
                <div>{new Date(createdAt * 1000).toString()}</div>
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
