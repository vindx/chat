import React from 'react';
import PropTypes from 'prop-types';

import Login from '../routes/Login';
import SignUp from '../routes/SignUp';
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
          <SignUp history={history} />
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
