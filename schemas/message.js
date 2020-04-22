module.exports = `
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
    createdAt: String!
  }
  
  type Query {
    getMessage(id: ID!): Message!
    getMessages(channelId: ID!): [Message!]!
  }
  
  type Mutation {
    createMessage(channelId: ID!, text: String!): Message!
  }
`;
