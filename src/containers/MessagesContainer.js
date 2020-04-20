import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

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

const MessagesContainer = ({ currentChannelId }) => {
  const { loading, error, data: { getChannel: { messages } = {} } = {} } = useQuery(
    getMessagesQuery,
    {
      variables: { id: currentChannelId },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (!messages) {
    return (
      <Messages style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Please choose channel
      </Messages>
    );
  }
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

MessagesContainer.propTypes = {
  currentChannelId: PropTypes.string,
};
MessagesContainer.defaultProps = {
  currentChannelId: undefined,
};

export default MessagesContainer;
