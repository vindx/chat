import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

import ViewChannel from './ViewChannel';
import LoginOrRegisterContainer from '../containers/LoginOrResgisterContainer';
import PageNotFound from '../components/PageNotFound';
import useTheme from '../hooks/useTheme';
import GlobalStyle from '../components/styledComponents/GlobalStyle';

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

export default () => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Switch>
          <PrivateRoute path="/" exact component={() => <Redirect to="/view-channel" />} />
          <Route path="/register" exact component={LoginOrRegisterContainer} />
          <Route path="/login" exact component={LoginOrRegisterContainer} />
          <PrivateRoute path="/view-channel/:channelId?" exact component={ViewChannel} />
          <PageNotFound />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
