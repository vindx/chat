import React, { useState } from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

const registerMutation = gql`
  mutation($userName: String!, $email: String!, $password: String!) {
    register(userName: $userName, email: $email, password: $password) {
      ok
      errors {
        type
        path
        message
      }
    }
  }
`;

const Register = (props) => {
  const [register, { loading }] = useMutation(registerMutation);
  const [loginData, setLoginData] = useState({
    userName: '',
    userNameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  });
  const { userName, email, password, userNameError, emailError, passwordError } = loginData;

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value, [`${name}Error`]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ variables: { userName, email, password } });
      const { ok, errors } = response.data.register;

      if (ok) {
        props.history.push('/');
      } else {
        const err = errors.reduce((acc, { path, message }) => {
          acc[`${path}Error`] = message;
          return acc;
        }, {});
        setLoginData({ ...loginData, ...err });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container text>
      <Header as="h2">Register</Header>
      <form onSubmit={handleSubmit}>
        <Input
          fluid
          placeholder="Username"
          name="userName"
          value={userName}
          onChange={handleChangeLoginData}
        />
        <span style={{ color: 'red' }}>{userNameError}</span>
        <Input
          fluid
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChangeLoginData}
        />
        <span style={{ color: 'red' }}>{emailError}</span>
        <Input
          fluid
          placeholder="Password"
          name="password"
          type="password"
          value={password}
          onChange={handleChangeLoginData}
        />
        <span style={{ color: 'red' }}>{passwordError}</span>
        <Button
          negative={!!userNameError || !!emailError || !!passwordError}
          loading={loading}
          floated="right"
          compact
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Register;
