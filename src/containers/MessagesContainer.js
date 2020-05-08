import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Dropdown, Label } from 'semantic-ui-react';
import prettydate from 'pretty-date';
import PropTypes from 'prop-types';

import {
  CreatedAt,
  Message,
  MessageHeader,
  MessagesWrapper,
  MessageText,
  MessageWrapper,
  UserName,
} from '../components/styledComponents/Messages';
import DeleteMessageModal from '../components/DeleteMessageModal';
import {
  getMessagesQuery,
  newMessageSubscription,
  deleteMessageSubscription,
  editingMessageSubscription,
} from '../graphql/message';

const MessagesContainer = ({
  currentChannelId = '',
  activeUserId,
  initEditing,
  messageEditingInfo,
}) => {
  const [messageIdForDeleteMessageModal, setMessageIdForDeleteMessageModal] = useState(null);

  const handleOpenDeleteMessageModal = (e, data) => {
    setMessageIdForDeleteMessageModal(data.messageid);
  };

  const handleCloseDeleteMessageModal = () => {
    setMessageIdForDeleteMessageModal(null);
  };

  const messagesLimit = 30;
  let offset = 0;
  const {
    subscribeToMore,
    loading,
    error,
    data: { getMessages: messages } = {},
    fetchMore,
  } = useQuery(getMessagesQuery, {
    variables: { channelId: currentChannelId, offset, limit: messagesLimit },
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
          offset = messages.length;
          fetchMore({
            variables: {
              channelId: currentChannelId,
              offset,
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
      const newMessageUnSubscribe = subscribeToMore({
        document: newMessageSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return {
            ...prev,
            getMessages: [subscriptionData.data.newChannelMessage, ...prev.getMessages],
          };
        },
      });
      const editingMessageUnSubscribe = subscribeToMore({
        document: editingMessageSubscription,
        variables: {
          channelId: currentChannelId,
          messageId: messageEditingInfo.messageId,
          text: messageEditingInfo.message,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;
          return {
            ...prev,
            getMessages: prev.getMessages.map((message) => {
              if (message.id === subscriptionData.data.editMessage.id) {
                return { ...message, text: subscriptionData.data.editMessage.text };
              }
              return message;
            }),
          };
        },
      });
      const deleteMessageUnSubscribe = subscribeToMore({
        document: deleteMessageSubscription,
        variables: { channelId: currentChannelId, messageId: messageIdForDeleteMessageModal },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;

          return {
            ...prev,
            getMessages: prev.getMessages.filter(
              ({ id }) => id !== subscriptionData.data.deleteMessage.id
            ),
          };
        },
      });
      return () => {
        newMessageUnSubscribe();
        deleteMessageUnSubscribe();
        editingMessageUnSubscribe();
      };
    }
  }, [currentChannelId, subscribeToMore, messageIdForDeleteMessageModal, messageEditingInfo]);

  if (loading) return <p>Loading...</p>;
  if (!messages) {
    return (
      <MessagesWrapper center>
        Please choose channel
        {currentChannelId && error && <Label color="red">{error.message}</Label>}
      </MessagesWrapper>
    );
  }

  return [
    <MessagesWrapper key="messages-block">
      {[...messages].map(({ id, text, user: { id: userId, userName }, createdAt }, index) => (
        <MessageWrapper key={`message-${id}`} myMessage={activeUserId === userId}>
          <Message
            ref={messages.length === index + 5 ? lastMessageElementRef : null}
            myMessage={activeUserId === userId}
          >
            <MessageHeader myMessage={activeUserId === userId}>
              <UserName>{userName}</UserName>
              {activeUserId === userId && (
                <Dropdown icon="options" style={{ margin: '0 10px' }} pointing="bottom right">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text="Delete"
                      icon="trash"
                      messageid={id}
                      onClick={handleOpenDeleteMessageModal}
                    />
                    <Dropdown.Item
                      text="Edit"
                      icon="edit"
                      messageid={id}
                      message={text}
                      onClick={initEditing}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </MessageHeader>

            <MessageText>{text}</MessageText>
            <CreatedAt>{prettydate.format(new Date(Number(createdAt)))}</CreatedAt>
          </Message>
        </MessageWrapper>
      ))}
    </MessagesWrapper>,
    <DeleteMessageModal
      key="delete-message-modal"
      isOpen={!!messageIdForDeleteMessageModal}
      channelId={currentChannelId}
      onClose={handleCloseDeleteMessageModal}
      messageId={messageIdForDeleteMessageModal}
      queryOptions={{ limit: messagesLimit, offset }}
    />,
  ];
};

MessagesContainer.propTypes = {
  currentChannelId: PropTypes.string,
  activeUserId: PropTypes.string.isRequired,
  initEditing: PropTypes.func.isRequired,
};
MessagesContainer.defaultProps = {
  currentChannelId: undefined,
};

export default MessagesContainer;
