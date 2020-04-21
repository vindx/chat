import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';

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
  const [addChannelModalToggle, setToggleAddChannelModal] = useState(false);

  const handleOpenAddChannelModal = () => {
    setToggleAddChannelModal(true);
  };

  const handleCloseAddChannelModal = () => {
    setToggleAddChannelModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return [
    <Channels
      key="channels"
      channels={channels}
      currentChannelId={currentChannelId}
      onAddChannelClick={handleOpenAddChannelModal}
    />,
    <AddChannelModal
      key="add-channel-modal"
      isOpen={addChannelModalToggle}
      onClose={handleCloseAddChannelModal}
    />,
  ];
};

ChannelsContainer.propTypes = {
  currentChannelId: PropTypes.string,
};
ChannelsContainer.defaultProps = {
  currentChannelId: undefined,
};

export default ChannelsContainer;
