import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SignOutButton = ({ history, ...props }) => {
  const onLogOutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    history.push('/');
  };

  return (
    <Button negative onClick={onLogOutClick} {...props}>
      Sign out
    </Button>
  );
};

SignOutButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default SignOutButton;
