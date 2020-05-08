module.exports = `
  type Channel {
    id: ID!
    name: String!
    owner: User!
    messages: [Message!]
    members: [User!]!
  }
  
  type channelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }
  
   type Subscription {
    smbJoinedChannel(channelId: ID!): Channel!
    smbLeftChannel(channelId: ID!): Channel!
  }
  
  type Query {
    getChannel(channelId: ID!): Channel!
    getAllChannels: [Channel!]!
  }
  
  type Mutation {
    createChannel(name: String!): channelResponse!
    joinChannel(secretKey: String!): channelResponse!
    leaveChannel(channelId: ID!): channelResponse!
    deleteChannel(channelId: ID!): channelResponse!
  }
`;
