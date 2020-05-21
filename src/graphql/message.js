import { gql } from 'apollo-boost';

export const getMessagesQuery = gql`
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

export const createMessageMutation = gql`
  mutation($channelId: ID!, $text: String!) {
    createMessage(channelId: $channelId, text: $text) {
      id
      text
    }
  }
`;

export const editMessageMutation = gql`
  mutation($channelId: ID!, $messageId: ID!, $text: String!) {
    editMessage(channelId: $channelId, messageId: $messageId, text: $text) {
      id
      text
    }
  }
`;

export const newMessageSubscription = gql`
  subscription($channelId: ID!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        id
        userName
      }
      channel {
        name
      }
      createdAt
    }
  }
`;

export const editingMessageSubscription = gql`
  subscription($channelId: ID!, $messageId: ID, $text: String) {
    editMessage(channelId: $channelId, messageId: $messageId, text: $text) {
      id
      text
    }
  }
`;

export const deleteMessageSubscription = gql`
  subscription($channelId: ID!, $messageId: ID) {
    deleteMessage(channelId: $channelId, messageId: $messageId) {
      id
    }
  }
`;

export const deleteMessageMutation = gql`
  mutation($channelId: ID!, $messageId: ID!) {
    deleteMessage(channelId: $channelId, messageId: $messageId) {
      ok
      message {
        id
      }
      errors {
        type
        path
        message
      }
    }
  }
`;
