import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Message, Icon } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import { wsLink } from '../apollo';
import { RedirectToOtherFormContainer } from '../components/styledComponents/LoginOrSignUp';
import { loginMutation, resendConfirmationEmail } from '../graphql/user';
import { CustomHeader, CustomInput } from '../components/styledComponents/GlobalStyle';

const Login = (props) => {
  const [login, { loading }] = useMutation(loginMutation);
  const [
    resendConfirmationLetter,
    { data: { resendConfirmationEmail: resendStatus } = {}, loading: resendLoading },
  ] = useMutation(resendConfirmationEmail);
  const [loginData, setLoginData] = useState({
    email: '',
    emailError: null,
    password: '',
    passwordError: null,
    confirmationError: null,
  });
  const { email, password, emailError, passwordError, confirmationError } = loginData;

  const handleInitResendingConfirmationLetter = async () => {
    await resendConfirmationLetter({ variables: { email } });
  };

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value, [`${name}Error`]: null, confirmationError: null });
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
      {confirmationError && (
        <Message warning>
          <Message.Header>{confirmationError}</Message.Header>
          <span>Didn&#39;t receive confirmation email yet? &#9658;</span>
          <Button
            compact
            basic
            loading={resendLoading}
            disabled={resendLoading}
            onClick={handleInitResendingConfirmationLetter}
          >
            Send again
          </Button>
          {typeof resendStatus === 'boolean' && (
            <span>
              <Icon
                color={resendStatus ? 'green' : 'red'}
                name={resendStatus ? 'check' : 'close'}
              />
            </span>
          )}
        </Message>
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
