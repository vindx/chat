import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';

const httpLink = createUploadLink({
  uri: '/graphql',
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

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,

    connectionParams: () => ({
      'auth-token': localStorage.getItem('token'),
      'auth-refresh-token': localStorage.getItem('refreshToken'),
    }),
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  from([middlewareAuthLink, afterWareLink, httpLink])
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
