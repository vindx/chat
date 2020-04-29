import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Header, Input, Message } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

const loginMutation = gql`
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

const Login = (props) => {
  const [login, { loading }] = useMutation(loginMutation);
  const [loginData, setLoginData] = useState({
    email: '',
    emailError: null,
    password: '',
    passwordError: null,
  });
  const { email, password, emailError, passwordError } = loginData;

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value, [`${name}Error`]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });
      const { ok, token, refreshToken, errors } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        props.history.push('/view-channel');
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
      <Header as="h2">Login</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field error={!!emailError}>
          <Input
            fluid
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <Input
            fluid
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Button negative={!!emailError || !!passwordError} loading={loading} compact>
          Submit
        </Button>
      </Form>
      <Link to="/register">
        <Button compact floated="right">
          Register
        </Button>
      </Link>
      {(emailError || passwordError) && (
        <Message
          error
          header="There was some errors with your submission"
          list={[emailError, passwordError]}
        />
      )}
    </Container>
  );
};

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;
