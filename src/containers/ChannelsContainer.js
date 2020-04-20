import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import Channels from '../components/Channels';

const allChannelsQuery = gql`
  {
    getAllChannels {
      id
      name
    }
  }
`;

const ChannelsContainer = ({ currentChannelId }) => {
  const { loading, error, data: { getAllChannels: channels } = {} } = useQuery(allChannelsQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <Channels channels={channels} currentChannelId={currentChannelId} />;
};

ChannelsContainer.propTypes = {
  currentChannelId: PropTypes.string,
};
ChannelsContainer.defaultProps = {
  currentChannelId: undefined,
};

export default ChannelsContainer;
