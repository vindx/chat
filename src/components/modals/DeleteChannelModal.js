import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { deleteChannelMutation } from '../../graphql/channel';
import {
  CustomModalActions,
  CustomModalContent,
  CustomModalHeader,
} from '../styledComponents/GlobalStyle';

const DeleteChannelModal = ({ onClose, channelId, history, updateQuery }) => {
  const [handleDeleteChannel, { loading }] = useMutation(deleteChannelMutation, {
    variables: { channelId },
    update: (store, { data: { deleteChannel } }) => {
      const { ok, channel } = deleteChannel;
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
      <CustomModalHeader>Delete This Channel?</CustomModalHeader>
      <CustomModalContent>
        <p>
          Are you sure you want to delete this channel?
          <br />
          All data will be lost!
        </p>
      </CustomModalContent>
      <CustomModalActions>
        <Button positive onClick={onClose}>
          No
        </Button>
        <Button
          negative
          icon="delete"
          labelPosition="right"
          content="Yes"
          loading={loading}
          onClick={handleDeleteChannel}
        />
      </CustomModalActions>
    </>
  );
};

DeleteChannelModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateQuery: PropTypes.func.isRequired,
};

export default DeleteChannelModal;
