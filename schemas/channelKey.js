module.exports = `
  type ChannelKey {
    id: ID!
    shortId: String!
    channelId: ID!
  }
  
  type createChannelKeyResponse {
    ok: Boolean!
    channelKey: ChannelKey
    errors: [Error!]
  }
  
  type Mutation {
    createChannelKey(channelId: ID!): createChannelKeyResponse!
  }
`;
