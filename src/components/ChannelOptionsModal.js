import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import LeaveChannelModal from './LeaveChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import { allChannelsQuery } from '../graphql/channel';

const updateQuery = (store, channel) => {
  const data = store.readQuery({ query: allChannelsQuery });
  data.getAllChannels = data.getAllChannels.filter(({ id }) => id !== channel.id);
  store.writeQuery({ query: allChannelsQuery, data });
};

const ChannelOptionsModal = ({ isOpen, onClose, viewMode, channelId, history }) => (
  <Modal size="mini" open={isOpen} onClose={onClose}>
    {viewMode ? (
      <LeaveChannelModal
        onClose={onClose}
        channelId={channelId}
        history={history}
        updateQuery={updateQuery}
      />
    ) : (
      <DeleteChannelModal
        onClose={onClose}
        channelId={channelId}
        history={history}
        updateQuery={updateQuery}
      />
    )}
  </Modal>
);

ChannelOptionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  viewMode: PropTypes.bool.isRequired,
  channelId: PropTypes.string.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default ChannelOptionsModal;