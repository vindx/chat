module.exports = `
  type User {
    id: ID!
    userName: String!
    email: String!
    channels: [Channel!]!
  }

  type Query {
    getUser(id: ID!): User!
    getAllUsers: [User!]!
  }

  type Mutation {
    register(userName: String!, email: String!, password: String!): Boolean!
  }
`;
