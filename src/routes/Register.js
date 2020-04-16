import React, { useState } from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const registerMutation = gql`
  mutation($userName: String!, $email: String!, $password: String!) {
    register(userName: $userName, email: $email, password: $password)
  }
`;

const Register = () => {
  const [register, { data, loading, error }] = useMutation(registerMutation);
  const [loginData, setLoginData] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const { userName, email, password } = loginData;

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await register({ variables: loginData });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container text>
      <Header as="h2">Register</Header>
      <Input
        fluid
        placeholder="Username"
        name="userName"
        value={userName}
        onChange={handleChangeLoginData}
      />
      <Input
        fluid
        placeholder="Email"
        name="email"
        value={email}
        onChange={handleChangeLoginData}
      />
      <Input
        fluid
        placeholder="Password"
        name="password"
        type="password"
        value={password}
        onChange={handleChangeLoginData}
      />
      <Button
        loading={loading}
        positive={!!data}
        negative={!!error}
        floated="right"
        compact
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Container>
  );
};

export default Register;
