import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';
import 'semantic-ui-css/semantic.min.css';

import * as serviceWorker from './serviceWorker';
import Routes from './routes';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

// Setup the header for the request
const middlewareAuthLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  return {
    headers: {
      ...headers,
      'auth-token': token,
      'auth-refresh-token': refreshToken,
    },
  };
});

// After the backend responds, we take the refreshToken from headers if it exists
// and save it in the localstorage

// eslint-disable-next-line arrow-body-style
const afterWareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();

    if (headers) {
      const token = headers.get('auth-token');
      const refreshToken = headers.get('auth-refresh-token');
      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  });
});

const client = new ApolloClient({
  link: from([middlewareAuthLink, afterWareLink, httpLink]),
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
