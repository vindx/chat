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

export const leaveChannelMutation = gql`
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

export const deleteChannelMutation = gql`
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

export const createChannelMutation = gql`
  mutation($name: String!) {
    createChannel(name: $name) {
      ok
      channel {
        id
        name
      }
      errors {
        path
        type
        message
      }
    }
  }
`;

export const joinChannelMutation = gql`
  mutation($secretKey: String!) {
    joinChannel(secretKey: $secretKey) {
      ok
      channel {
        id
        name
      }
      errors {
        message
      }
    }
  }
`;

export const editChannelNameMutation = gql`
  mutation($channelId: ID!, $channelName: String!) {
    editChannelName(channelId: $channelId, channelName: $channelName) {
      ok
      channel {
        id
        name
      }
      errors {
        message
      }
    }
  }
`;

export const smbJoinedChannelSubscription = gql`
  subscription($channelId: ID!) {
    smbJoinedChannel(channelId: $channelId) {
      members {
        id
        userName
      }
    }
  }
`;

export const smbLeftChannelSubscription = gql`
  subscription($channelId: ID!) {
    smbLeftChannel(channelId: $channelId) {
      members {
        id
        userName
      }
    }
  }
`;
