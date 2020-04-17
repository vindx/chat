import React, { useState } from 'react';
import { Button, Container, Header, Input } from 'semantic-ui-react';

const Login = () => {
  const [loginData, setLoginData] = useState({
    userName: '',
    userNameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  });
  const { email, password } = loginData;

  const handleChangeLoginData = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value, [`${name}Error`]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <form onSubmit={handleSubmit}>
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
        <Button compact>Submit</Button>
      </form>
    </Container>
  );
};

export default Login;
