import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Dimmer, Dropdown, Label, Loader } from 'semantic-ui-react';
import prettydate from 'pretty-date';
import reactStringReplace from 'react-string-replace';
import { Emoji } from 'emoji-mart';
import Push from 'push.js';
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
import DeleteMessageModal from '../components/modals/DeleteMessageModal';
import {
  getMessagesQuery,
  newMessageSubscription,
  deleteMessageSubscription,
  editingMessageSubscription,
} from '../graphql/message';
import { CustomDropdownMenu } from '../components/styledComponents/GlobalStyle';

const MessagesContainer = ({
  currentChannelId = '',
  activeUserId,
  initEditing,
  messageEditingInfo,
  setLastMessageSent,
  onProfileClick,
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
      let windowIsActive = true;
      const handleActivity = (forcedFlag) => {
        if (typeof forcedFlag === 'boolean') {
          // eslint-disable-next-line no-return-assign
          return forcedFlag ? (windowIsActive = true) : (windowIsActive = false);
        }

        // eslint-disable-next-line no-return-assign
        return document.hidden ? (windowIsActive = false) : (windowIsActive = true);
      };
      document.addEventListener('visibilitychange', handleActivity);
      document.addEventListener('blur', () => handleActivity(false));
      window.addEventListener('blur', () => handleActivity(false));
      window.addEventListener('focus', () => handleActivity(true));
      document.addEventListener('focus', () => handleActivity(true));
      const newMessageUnSubscribe = subscribeToMore({
        document: newMessageSubscription,
        variables: { channelId: currentChannelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) return prev;
          if (activeUserId === subscriptionData.data.newChannelMessage.user.id) {
            setLastMessageSent(
              subscriptionData.data.newChannelMessage.text,
              subscriptionData.data.newChannelMessage.id
            );
          }

          if (!windowIsActive) {
            Push.create(`New message on #${subscriptionData.data.newChannelMessage.channel.name}`, {
              body: `${subscriptionData.data.newChannelMessage.user.userName} says:
${subscriptionData.data.newChannelMessage.text}`,
              icon: '../logo.png',
              data: 'sdasdasd',
              timeout: 3000,
              onClick() {
                window.focus();
                this.close();
              },
            });
          }

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
        window.removeEventListener('blur', handleActivity);
        document.removeEventListener('blur', handleActivity);
        window.removeEventListener('focus', handleActivity);
        document.removeEventListener('focus', handleActivity);
        document.removeEventListener('visibilitychange', handleActivity);
      };
    }
  }, [
    currentChannelId,
    subscribeToMore,
    messageIdForDeleteMessageModal,
    messageEditingInfo,
    activeUserId,
    setLastMessageSent,
  ]);

  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }
  if (error || !messages) {
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
              <UserName id={userId} onClick={onProfileClick}>
                {userName}
              </UserName>
              {activeUserId === userId && (
                <Dropdown icon="options" style={{ margin: '0 10px' }} pointing="bottom right">
                  <CustomDropdownMenu>
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
                  </CustomDropdownMenu>
                </Dropdown>
              )}
            </MessageHeader>

            <MessageText>
              {reactStringReplace(text, /:(.+?):/g, (match, i) => (
                <Emoji key={i} emoji={match} size={18} />
              ))}
            </MessageText>
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
