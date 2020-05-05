import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import ViewChannel from './ViewChannel';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
    const { exp } = decode(refreshToken);
    if (Date.now() / 1000 > exp) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    render={(props) => (isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />)}
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...rest}
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute path="/" exact component={() => <Redirect to="/view-channel" />} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/view-channel/:channelId?" exact component={ViewChannel} />
      <Route path="/users" exact component={Home} />
    </Switch>
  </BrowserRouter>
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
