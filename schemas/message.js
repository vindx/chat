module.exports = `
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
    createdAt: String!
  }
  
  type Subscription {
    newChannelMessage(channelId: ID!): Message!
  }
  
  type Query {
    getMessage(id: ID!): Message!
    getMessages(offset: Int, limit: Int, channelId: ID!): [Message!]!
  }
  
  type Mutation {
    createMessage(channelId: ID!, text: String!): Message!
  }
`;
