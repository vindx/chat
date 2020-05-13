import { gql } from 'apollo-boost';

export const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        type
        path
        message
      }
    }
  }
`;

export const registerMutation = gql`
  mutation($userName: String!, $email: String!, $password: String!) {
    register(userName: $userName, email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        type
        path
        message
      }
    }
  }
`;

export const getUserQuery = gql`
  query($id: ID) {
    getUser(id: $id) {
      userName
      email
      channels {
        id
        name
      }
      messages {
        id
        text
        channel {
          name
        }
        createdAt
      }
    }
  }
`;
