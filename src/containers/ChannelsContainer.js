import React, { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';

import Channels from '../components/Channels';
import AddChannelModal from '../components/modals/AddChannelModal';
import { takeAllChannels } from '../redux/actions';

const ChannelsContainer = ({
  currentChannelId,
  history,
  onProfileClick,
  activeUserId,
  loading,
  error,
  data: { getAllChannels: channels = [] },
}) => {
  const dispatch = useDispatch();
  const [addChannelModalIsOpen, setToggleAddChannelModal] = useState(false);

  useEffect(() => {
    dispatch(takeAllChannels());
  }, [dispatch]);

  const toggleAddChannelModal = () => {
    setToggleAddChannelModal(!addChannelModalIsOpen);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return [
    <Channels
      key="channels"
      channels={channels}
      currentChannelId={currentChannelId}
      onAddChannelClick={toggleAddChannelModal}
      onProfileClick={onProfileClick}
      activeUserId={activeUserId}
    />,
    <AddChannelModal
      key="add-channel-modal"
      isOpen={addChannelModalIsOpen}
      onClose={toggleAddChannelModal}
      history={history}
    />,
  ];
};

const mapStateToProps = (state) => ({
  loading: state.channels.loading,
  data: state.channels.data,
  error: state.channels.error,
});

ChannelsContainer.propTypes = {
  currentChannelId: PropTypes.string,
  history: PropTypes.shape({}).isRequired,
  onProfileClick: PropTypes.func.isRequired,
};
ChannelsContainer.defaultProps = {
  currentChannelId: undefined,
};

export default connect(mapStateToProps)(ChannelsContainer);
