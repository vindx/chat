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
      id
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
          id
          name
        }
        createdAt
      }
    }
  }
`;

export const editUserNameMutation = gql`
  mutation($newUserName: String!) {
    editUserName(newUserName: $newUserName) {
      ok
      user {
        id
        userName
        email
      }
      errors {
        message
      }
    }
  }
`;

export const editPasswordMutation = gql`
  mutation($oldPassword: String!, $newPassword: String!) {
    editPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      ok
      user {
        id
        userName
        email
      }
      errors {
        message
      }
      token
      refreshToken
    }
  }
`;
