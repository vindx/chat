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
  
  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }
 
  type Mutation {
    register(userName: String!, email: String!, password: String!): RegisterResponse!
  }
`;
