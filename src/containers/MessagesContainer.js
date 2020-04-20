import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Messages from '../components/Messages';

const getMessagesQuery = gql`
  query($id: ID!) {
    getChannel(id: $id) {
      messages {
        id
        text
      }
    }
  }
`;

const MessagesContainer = () => {
  const { loading, error, data: { getChannel: { messages } = {} } = {} } = useQuery(
    getMessagesQuery,
    {
      variables: { id: '5e9d93183615d8062c2c8ede' },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Messages>
      <ul>
        {messages.map(({ id, text }) => (
          <li key={`message-${id}`}>{text}</li>
        ))}
      </ul>
    </Messages>
  );
};

export default MessagesContainer;
