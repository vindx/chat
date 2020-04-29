import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import { allChannelsQuery } from '../graphql/channel';

const ChannelsContainer = ({ currentChannelId, history }) => {
  const { loading, error, data: { getAllChannels: channels } = {} } = useQuery(allChannelsQuery, {
    fetchPolicy: 'network-only',
  });
  const [addChannelModalIsOpen, setToggleAddChannelModal] = useState(false);

  const toggleAddChannelModal = () => {
    setToggleAddChannelModal(!addChannelModalIsOpen);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    history.push('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return [
    <Channels
      key="channels"
      channels={channels}
      currentChannelId={currentChannelId}
      onAddChannelClick={toggleAddChannelModal}
      onLogOutClick={handleLogOut}
    />,
    <AddChannelModal
      key="add-channel-modal"
      isOpen={addChannelModalIsOpen}
      onClose={toggleAddChannelModal}
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
