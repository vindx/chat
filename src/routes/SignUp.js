import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Button, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import { RedirectToOtherFormContainer } from '../components/styledComponents/LoginOrSignUp';
import { registerMutation } from '../graphql/user';
import { CustomHeader, CustomInput } from '../components/styledComponents/GlobalStyle';

const SignUp = () => {
  const [register, { loading }] = useMutation(registerMutation);
  const [loginData, setLoginData] = useState({
    userName: '',
    userNameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    successfulSignUpMessage: '',
  });
  const {
    userName,
    email,
    password,
    userNameError,
    emailError,
    passwordError,
    successfulSignUpMessage,
  } = loginData;

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
      [`${name}Error`]: null,
      successfulSignUpMessage: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ variables: { userName, email, password } });
      const { ok, successMessage, errors } = response.data.register;

      if (ok) {
        setLoginData((prevState) => ({ ...prevState, successfulSignUpMessage: successMessage }));
      } else {
        const err = errors.reduce((acc, { path, message }) => {
          acc[`${path}Error`] = message;
          return acc;
        }, {});
        setLoginData({ ...loginData, ...err, successfulSignUpMessage: '' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container text>
      <CustomHeader as="h2">Sign up</CustomHeader>
      <Form onSubmit={handleSubmit}>
        <Form.Field error={!!userNameError}>
          <CustomInput
            fluid
            autoComplete="off"
            placeholder="Username"
            name="userName"
            value={userName}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!emailError}>
          <CustomInput
            fluid
            autoComplete="off"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChangeLoginData}
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <CustomInput
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
      {successfulSignUpMessage && (
        <Message
          success
          header="Your registration was successful"
          content={successfulSignUpMessage}
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
