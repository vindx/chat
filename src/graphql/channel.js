import { gql } from 'apollo-boost';

export const allChannelsQuery = gql`
  {
    getAllChannels {
      id
      name
    }
  }
`;

export const getChannelQuery = gql`
  query($id: ID!) {
    getChannel(channelId: $id) {
      id
      name
      owner {
        id
        userName
      }
      members {
        id
        userName
      }
    }
  }
`;

export const leaveChannelQuery = gql`
  mutation($channelId: ID!) {
    leaveChannel(channelId: $channelId) {
      ok
      channel {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export const deleteChannelQuery = gql`
  mutation($channelId: ID!) {
    deleteChannel(channelId: $channelId) {
      ok
      channel {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;
