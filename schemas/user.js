module.exports = `
  type User {
    id: ID!
    userName: String!
    email: String!
    channels: [Channel!]
  }
`;
