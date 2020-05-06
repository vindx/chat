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

export const messageSubscription = gql`
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
