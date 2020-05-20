import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { leaveChannelMutation } from '../../graphql/channel';
import { CustomModalActions, CustomModalContent, CustomModalHeader } from '../styledComponents/GlobalStyle';

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
      <CustomModalHeader>Leave This Channel?</CustomModalHeader>
      <CustomModalContent>
        <p>Are you sure you want to leave this channel?</p>
      </CustomModalContent>
      <CustomModalActions>
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
      </CustomModalActions>
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
