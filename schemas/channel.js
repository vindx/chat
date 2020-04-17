module.exports = `
  type Channel {
    id: ID!
    name: String!
    owner: User!
    messages: [Message!]
    members: [User!]!
  }
  
  type createChannelResponse {
    ok: Boolean!
    errors: [Error!]
  }
  
  type Query {
    getChannel(id: ID!): Channel!
    getAllChannels: [Channel!]!
  }
  
  type Mutation {
    createChannel(name: String!): createChannelResponse!
  }
`;
