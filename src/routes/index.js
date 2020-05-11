import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';

import Home from './Home';
import ViewChannel from './ViewChannel';
import LoginOrRegisterContainer from '../containers/LoginOrResgisterContainer';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    const {
      user: { id: userId },
      exp,
    } = decode(refreshToken);
    if (Date.now() / 1000 > exp) {
      return false;
    }
    return userId;
  } catch (err) {
    return false;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    render={(props) =>
      (isAuthenticated() ? (
        <Component {...props} userId={isAuthenticated()} />
      ) : (
        <Redirect to="/login" />
      ))}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...rest}
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/" exact component={() => <Redirect to="/view-channel" />} />
      <Route path="/register" exact component={LoginOrRegisterContainer} />
      <Route path="/login" exact component={LoginOrRegisterContainer} />
      <PrivateRoute path="/view-channel/:channelId?" exact component={ViewChannel} />
      <Route path="/users" exact component={Home} />
    </Switch>
  </BrowserRouter>
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
