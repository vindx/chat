import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { leaveChannelMutation } from '../graphql/channel';

const LeaveChannelModal = ({ onClose, channelId, history, updateQuery }) => {
  const [handleLeaveChannel, { loading }] = useMutation(leaveChannelMutation, {
    variables: { channelId },
    update: (store, { data: { leaveChannel } }) => {
      const { ok, channel } = leaveChannel;
      if (!ok) {
        return;
      }
      updateQuery(store, channel);
      onClose();
      history.push('');
    },
  });

  return (
    <>
      <Modal.Header>Leave This Channel?</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to leave this channel?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={onClose}>
          No
        </Button>
        <Button
          negative
          icon="arrow alternate circle right"
          labelPosition="right"
          content="Yes"
          loading={loading}
          onClick={handleLeaveChannel}
        />
      </Modal.Actions>
    </>
  );
};

LeaveChannelModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateQuery: PropTypes.func.isRequired,
};

export default LeaveChannelModal;
