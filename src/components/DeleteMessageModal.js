import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { deleteMessageMutation, getMessagesQuery } from '../graphql/message';

const DeleteMessageModal = ({
  isOpen,
  onClose,
  channelId,
  messageId,
  queryOptions: { limit, offset },
}) => {
  const [handleDeleteChannel, { loading }] = useMutation(deleteMessageMutation, {
    variables: { channelId, messageId },
    update: (store, { data: { deleteMessage } }) => {
      const { ok, message } = deleteMessage;
      if (!ok) {
        return;
      }
      const data = store.readQuery({
        query: getMessagesQuery,
        variables: { channelId, limit, offset },
      });
      data.getMessages = data.getMessages.filter(({ id }) => id !== message.id);
      store.writeQuery({ query: getMessagesQuery, variables: { channelId, limit, offset }, data });
      onClose();
    },
  });

  return (
    <Modal size="mini" open={isOpen} onClose={onClose}>
      <Modal.Header>Delete this message?</Modal.Header>
      <Modal.Content>
        <p>
          Are you sure you want to delete this message?
          <br />
          It will be lost forever!
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={onClose}>
          No
        </Button>
        <Button
          negative
          icon="delete"
          labelPosition="right"
          content="Delete"
          loading={loading}
          onClick={handleDeleteChannel}
        />
      </Modal.Actions>
    </Modal>
  );
};

DeleteMessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  channelId: PropTypes.string.isRequired,
  messageId: PropTypes.string,
  queryOptions: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
  }).isRequired,
};
DeleteMessageModal.defaultProps = {
  messageId: null,
};

export default DeleteMessageModal;
