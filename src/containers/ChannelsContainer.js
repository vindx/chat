import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import { allChannelsQuery } from '../graphql/channel';

const ChannelsContainer = ({ currentChannelId, history }) => {
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
      history={history}
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
