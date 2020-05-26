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
      successMessage
      errors {
        type
        path
        message
      }
    }
  }
`;

export const resendConfirmationEmail = gql`
  mutation($email: String!) {
    resendConfirmationEmail(email: $email)
  }
`;

export const getUserQuery = gql`
  query($id: ID, $offset: Int, $limit: Int) {
    getUser(id: $id, offset: $offset, limit: $limit) {
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
