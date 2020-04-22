import React from 'react';
import { Header, Modal, Segment, Grid, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CreateChannelForm from './CreateChannelForm';
import JoinChannelForm from './JoinChannelForm';

const AddChannelModal = ({ isOpen, onClose, history }) => (
  <Modal open={isOpen} onClose={onClose} closeIcon>
    <Modal.Content>
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <Header as="h3" textAlign="center">
              Create a channel!
            </Header>
            <Header as="h5" disabled textAlign="center">
              Create a new channel and invite people there
            </Header>
            <CreateChannelForm onClose={onClose} history={history} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h3" textAlign="center">
              Join a channel!
            </Header>
            <Header as="h5" disabled textAlign="center">
              Join an existing channel
            </Header>
            <JoinChannelForm onClose={onClose} history={history} />
          </Grid.Column>
        </Grid>
        <Divider vertical>or</Divider>
      </Segment>
    </Modal.Content>
  </Modal>
);

AddChannelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default AddChannelModal;
