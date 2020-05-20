import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import { wsLink } from '../apollo';
import { RedirectToOtherFormContainer } from '../components/styledComponents/LoginOrSignUp';
import { loginMutation } from '../graphql/user';
import { CustomHeader, CustomInput } from '../components/styledComponents/GlobalStyle';

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
        wsLink.subscriptionClient.tryReconnect();
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
      <CustomHeader as="h2">Login</CustomHeader>
      <Form onSubmit={handleSubmit}>
        <Form.Field error={!!emailError}>
          <CustomInput
            fluid
            autoComplete="username"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <CustomInput
            fluid
            autoComplete="current-password"
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Button negative={!!emailError || !!passwordError} loading={loading} compact floated="left">
          Submit
        </Button>
      </Form>
      <RedirectToOtherFormContainer>
        Don&#39;t have an account? &#9658;
        <Link to="/register">Sign up</Link>
      </RedirectToOtherFormContainer>
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
