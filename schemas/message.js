module.exports = `
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
  }
  
   type Query {
    getMessage(id: ID!): Message!
    getAllMessages: [Message!]!
  }
  
  type Mutation {
    createMessage(channelId: ID!, text: String!): Message!
  }
  
  
`;
