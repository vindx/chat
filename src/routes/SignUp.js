import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import { wsLink } from '../apollo';
import { RedirectToOtherFormContainer } from '../components/styledComponents/LoginOrSignUp';

const registerMutation = gql`
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

const SignUp = ({ history }) => {
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
    setLoginData({ ...loginData, [name]: value, [`${name}Error`]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ variables: { userName, email, password } });
      const { ok, token, refreshToken, errors } = response.data.register;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        wsLink.subscriptionClient.tryReconnect();
        history.push('/view-channel');
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
      <Header as="h2">Sign up</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field error={!!userNameError}>
          <Input
            fluid
            autoComplete="off"
            placeholder="Username"
            name="userName"
            value={userName}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!emailError}>
          <Input
            fluid
            autoComplete="off"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <Input
            fluid
            autoComplete="off"
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Button
          negative={!!userNameError || !!emailError || !!passwordError}
          loading={loading}
          compact
          floated="left"
        >
          Submit
        </Button>
      </Form>
      <RedirectToOtherFormContainer>
        Have an account? &#9658;
        <Link to="/login">Log in</Link>
      </RedirectToOtherFormContainer>
      {(userNameError || emailError || passwordError) && (
        <Message
          error
          header="There was some errors with your submission"
          list={[userNameError, emailError, passwordError]}
        />
      )}
    </Container>
  );
};

SignUp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUp;
