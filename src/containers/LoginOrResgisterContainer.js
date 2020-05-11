import React from 'react';
import PropTypes from 'prop-types';

import Login from '../routes/Login';
import Register from '../routes/Register';
import WelcomeBlock from '../components/WelcomeBlock';

const LoginOrRegisterContainer = ({ match: { path }, history }) => {
  switch (path) {
    case '/login':
      return (
        <>
          <WelcomeBlock />
          <Login history={history} />
        </>
      );
    case '/register':
      return (
        <>
          <WelcomeBlock />
          <Register history={history} />
        </>
      );
    default:
      return null;
  }
};

LoginOrRegisterContainer.propTypes = {
  match: PropTypes.shape({ path: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default LoginOrRegisterContainer;
