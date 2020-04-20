import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Channels from '../components/Channels';

const allChannelsQuery = gql`
  {
    getAllChannels {
      id
      name
    }
  }
`;

const ChannelsContainer = () => {
  const { loading, error, data: { getAllChannels: channels } = {} } = useQuery(allChannelsQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <Channels channels={channels} />;
};

export default ChannelsContainer;
