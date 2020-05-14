module.exports = `
  type User {
    id: ID!
    userName: String!
    email: String!
    channels: [Channel!]!
    messages: [Message!]!
  }

  type Query {
    getUser(id: ID): User!
    getAllUsers: [User!]!
  }
  
  type EditUserInfoResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }
  
  type RegisterResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }
  
  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }
 
  type Mutation {
    register(userName: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
    editUserName(newUserName: String!): EditUserInfoResponse!
    editPassword(oldPassword: String!, newPassword: String!): EditUserInfoResponse!
  }
`;
