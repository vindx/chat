module.exports = `
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
    createdAt: String!
  }
  
  type deleteMessageResponse {
    ok: Boolean!
    message: Message
    errors: [Error!]
  }
  
  type Subscription {
    newChannelMessage(channelId: ID!): Message!
    deleteMessage(channelId: ID!, messageId: ID): Message!
    editMessage(channelId: ID!, messageId: ID, text: String): Message!
  }
  
  type Query {
    getMessage(id: ID!): Message!
    getMessages(offset: Int, limit: Int, channelId: ID!): [Message!]!
  }
  
  type Mutation {
    createMessage(channelId: ID!, text: String!): Message!
    editMessage(channelId: ID!, messageId: ID!, text: String!): Message!
    deleteMessage(channelId: ID!, messageId: ID!): deleteMessageResponse!
  }
`;
