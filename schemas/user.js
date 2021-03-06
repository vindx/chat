module.exports = `
  type User {
    id: ID!
    userName: String!
    email: String!
    channels: [Channel!]!
    messages: [Message!]!
    darkTheme: Boolean!
    offset: Int
    limit: Int
  }

  type Query {
    getUser(id: ID, offset: Int, limit: Int): User!
    getAllUsers: [User!]!
  }
  
  type EditUserInfoResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
    token: String
    refreshToken: String
  }
  
  type RegisterResponse {
    ok: Boolean!
    successMessage: String
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
    resendConfirmationEmail(email: String!): Boolean!
    editUserName(newUserName: String!): EditUserInfoResponse!
    editPassword(oldPassword: String!, newPassword: String!): EditUserInfoResponse!
    changeTheme: Boolean!
  }
`;
